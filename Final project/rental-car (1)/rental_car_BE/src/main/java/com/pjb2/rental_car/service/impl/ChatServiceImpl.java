package com.pjb2.rental_car.service.impl;

import com.pjb2.rental_car.dto.request.ChatIdDTO;
import com.pjb2.rental_car.dto.request.ChatMessagePayloadDTO;
import com.pjb2.rental_car.dto.request.ChatMessageRequestDTO;
import com.pjb2.rental_car.dto.response.*;
import com.pjb2.rental_car.entity.*;
import com.pjb2.rental_car.exception.ApiException;
import com.pjb2.rental_car.repository.*;
import com.pjb2.rental_car.service.ChatService;
import com.pjb2.rental_car.util.JwtService;
import com.pjb2.rental_car.util.common.MessageStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final ChatMessageRepository chatMessageRepository;
    private final CarServiceImpl carServiceImpl;
    private final MessageAttachmentRepository messageAttachmentRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserImagesRepository userImagesRepository;

    @Transactional(rollbackFor = ApiException.class)
    @Override
    public ChatMessage saveMessages(String token, ChatMessageRequestDTO request) throws ApiException {
        String senderEmail = jwtService.getEmailFromToken(token);
        User sender = userRepository.findByEmail(senderEmail);
        var chatId = getChatRoomId(sender.getId(), request.getRecipientId(),true)
                .orElseThrow();
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setSender(sender);
        chatMessage.setRecipient(userRepository.findUserById(request.getRecipientId()));
        chatMessage.setContent(request.getContent());
        chatMessage.setChatId(chatId);
        ChatMessage savedChatMessage = chatMessageRepository.save(chatMessage);
//        if(!request.getListAttachmentUrl().isEmpty()){
//            List<MessageAttachment> listAttachments = request.getListAttachmentUrl().stream().map(url -> MessageAttachment.builder()
//                    .attachmentUrl(url)
//                    .message(savedChatMessage)
//                    .build()).toList();
//            messageAttachmentRepository.saveAll(listAttachments);
//        }
        //send message through websocket
        ChatMessagePayloadDTO payload = new ChatMessagePayloadDTO();
        payload.setContent(request.getContent());
        payload.setSenderId(sender.getId());
        payload.setRecipientId(request.getRecipientId());
        payload.setChatId(chatId);
//        payload.setNumberOfAttachments(request.getListAttachmentUrl().size());
//        payload.setListAttachments(request.getListAttachmentUrl());
        messagingTemplate.convertAndSendToUser(String.valueOf(request.getRecipientId()),"/queue/messages", payload);
        //send notify
        NotificationResponseDTO notify = new NotificationResponseDTO();
        notify.setChatId(savedChatMessage.getChatId());
        notify.setAvatarUrl(userImagesRepository.findAvatarByUserId(savedChatMessage.getSender().getId()) != null ?  userImagesRepository.findAvatarByUserId(savedChatMessage.getSender().getId()).getImageUrl() : null);
        notify.setName(savedChatMessage.getSender().getName());
        notify.setContent(savedChatMessage.getContent());
        notify.setType("message");
        //notify.setNoOfAttachment(savedChatMessage.getAttachments().size());
        //send to /user/{recipientId}/queue/notify
        messagingTemplate.convertAndSendToUser(String.valueOf(request.getRecipientId()),"/queue/notify", notify);
        return savedChatMessage;
    }
    @Transactional(rollbackFor = ApiException.class)
    @Override
    public List<String> saveMessageAttachments(List<MultipartFile> listAttachment) throws ApiException, IOException {
        List<String> listUrls = new ArrayList<>();
        for (MultipartFile file : listAttachment) {
            if (carServiceImpl.validateFile(file, true)) {
                String attachmentUrl = carServiceImpl.uploadImage(file);
                listUrls.add(attachmentUrl);
            }
        }
        return listUrls;
    }
// need to fix till using less SQL statement
    @Override
    public List<ChatBoxResponse> getListChatBoxResponse(String token) throws ApiException {
        String senderEmail = jwtService.getEmailFromToken(token);
        User sender = userRepository.findByEmail(senderEmail);
        List<ChatRoom> listChatRoom = chatRoomRepository.findBySenderId(sender.getId());
        List<ChatBoxResponse> listChatBoxResponse = listChatRoom.stream().map(chatRoom -> {
            ChatMessage latestMessage = chatMessageRepository.findLatestMessageByChatId(chatRoom.getChatId());
            return ChatBoxResponse.builder()
                    .chatId(chatRoom.getChatId())
                    .RecipientId(chatRoom.getRecipient().getId())
                    .RecipientName(chatRoom.getRecipient().getName())
                    .recipientAvatarUrl(userImagesRepository.findAvatarByUserId(chatRoom.getRecipient().getId())!= null ? userImagesRepository.findAvatarByUserId(chatRoom.getRecipient().getId()).getImageUrl() : "")
                    .latestMessage(latestMessage.getContent())
                    .messageSenderId(latestMessage.getSender().getId())
                    .numberOfAttachments(messageAttachmentRepository.findByMessageId(latestMessage.getId()).size())
                    .status(latestMessage.getStatus().toString())
                    .created_at(latestMessage.getCreatedAt())
                    .build();
        })
                .sorted(Comparator.comparing(ChatBoxResponse::getCreated_at).reversed()).toList();
        return listChatBoxResponse;
    }

    @Override
    public MessagePageResponse getMessagePageResponse(String chatId,String sort, int page, int size) throws ApiException {
        //Sorting
        Sort.Order order = new Sort.Order(Sort.Direction.DESC, "created_at");
        if (StringUtils.hasLength(sort)) {
            Pattern pattern = Pattern.compile("(\\w+?)(:)(.*)");
            Matcher matcher = pattern.matcher(sort);
            if (matcher.find()) {
                String columnName = matcher.group(1);
                if (matcher.group(3).equals("asc")) {
                    order = new Sort.Order(Sort.Direction.ASC, columnName);
                } else {
                    order = new Sort.Order(Sort.Direction.DESC, columnName);
                }

            }
        }
        int pageNo = 0;
        if (page > 0) {
            pageNo = page - 1;
        }
        //Paging
        Pageable pageable = PageRequest.of(pageNo, size, Sort.by(order));
        return getMessageDetailResponse(chatId, pageable);
    }
    @Override
    public ChatBoxResponse checkExistChatBox(String token, int recipientId) throws ApiException {
        String senderEmail = jwtService.getEmailFromToken(token);
        User sender = userRepository.findByEmail(senderEmail);
        Optional<ChatRoom> chatRoomOptional = chatRoomRepository.findBySenderIdAndRecipientId(sender.getId(), recipientId);
        if (chatRoomOptional.isEmpty()) {
            return null;
        }
        ChatRoom chatRoom = chatRoomOptional.get();
        ChatMessage latestMessage = chatMessageRepository.findLatestMessageByChatId(chatRoom.getChatId());
        return ChatBoxResponse.builder()
                .chatId(chatRoom.getChatId())
                .RecipientId(chatRoom.getRecipient().getId())
                .RecipientName(chatRoom.getRecipient().getName())
                .recipientAvatarUrl(userImagesRepository.findAvatarByUserId(chatRoom.getRecipient().getId())!= null ? userImagesRepository.findAvatarByUserId(chatRoom.getRecipient().getId()).getImageUrl() : "")
                .latestMessage(latestMessage.getContent())
                .messageSenderId(latestMessage.getSender().getId())
                .numberOfAttachments(messageAttachmentRepository.findByMessageId(latestMessage.getId()).size())
                .status(latestMessage.getStatus().toString())
                .created_at(latestMessage.getCreatedAt())
                .build();
    }

    @Override
    public void seenMessage(String token, ChatIdDTO dto) throws ApiException {
        String userEmail = jwtService.getEmailFromToken(token);
        User user = userRepository.findByEmail(userEmail);
        //find all message in which user is recipient in that chat room ( chatId )
        List<ChatMessage> unseenMessage = chatMessageRepository.findUnseenMessagesInChatBox(user.getId(),dto.getChatId());
        unseenMessage.forEach(chatMessage -> {chatMessage.setStatus(MessageStatus.SEEN);});
        chatMessageRepository.saveAll(unseenMessage);

        SeenMessageDTO seenMessageDTO = new SeenMessageDTO();
        seenMessageDTO.setNumberOfSeenMessages(unseenMessage.size());
        seenMessageDTO.setType("seen");
        messagingTemplate.convertAndSendToUser(String.valueOf(user.getId()),"/queue/notify",seenMessageDTO);

    }

    @Override
    public List<NotificationResponseDTO> getNotificationResponse(String token) throws ApiException {
        String userEmail = jwtService.getEmailFromToken(token);
        User user = userRepository.findByEmail(userEmail);
        List<ChatMessage> listNotify = chatMessageRepository.findUnseenMessages(user.getId());
        return listNotify.stream().map(message -> NotificationResponseDTO.builder()
                .chatId(message.getChatId())
                .avatarUrl(userImagesRepository.findAvatarByUserId(message.getSender().getId()) != null ? userImagesRepository.findAvatarByUserId(message.getSender().getId()).getImageUrl() : null)
                .name(message.getSender().getName())
                .content(message.getContent())
                .noOfAttachment(message.getAttachments().size())
                .build()).toList();
    }

    public MessagePageResponse getMessageDetailResponse(String chatId, Pageable pageable) throws ApiException {
        Page<ChatMessage> listChatMessages = chatMessageRepository.findHistoryMessageByChatId(chatId, pageable);
        List<MessageDetailResponse> messageDetailResponses = listChatMessages.getContent().stream().map(chatMessage -> MessageDetailResponse.builder()
                .chatId(chatId)
                .senderId(chatMessage.getSender().getId())
                .senderName(chatMessage.getSender().getName())
                .senderAvatar(userImagesRepository.findAvatarByUserId(chatMessage.getSender().getId()) != null ? userImagesRepository.findAvatarByUserId(chatMessage.getSender().getId()).getImageUrl() : "")
                .createdAt(chatMessage.getCreatedAt())
                .content(chatMessage.getContent())
                .listAttachmentsUrl(messageAttachmentRepository.findByMessageId(chatMessage.getId()).stream().map(MessageAttachment::getAttachmentUrl).toList())
                .build()
        ).collect(Collectors.toList());
        Collections.reverse(messageDetailResponses);
        MessagePageResponse response = new MessagePageResponse();
        response.setListMessages(messageDetailResponses);
        response.setPageNumber(listChatMessages.getNumber() + 1);
        response.setPageSize(pageable.getPageSize());
        response.setTotalElements(listChatMessages.getNumberOfElements());
        response.setTotalPages(listChatMessages.getTotalPages());
        return response;
    }


    public Optional<String> getChatRoomId(int senderId, int recipientId, boolean createNewRoomIfNotExist) {
        return  chatRoomRepository.findBySenderIdAndRecipientId(senderId,recipientId)
                .map(ChatRoom::getChatId).or(()->{
                    if (createNewRoomIfNotExist) {
                        var chatId = createChatId(senderId, recipientId);
                        return Optional.of(chatId);
                    }
                    return Optional.empty();
                });
    }
    private String createChatId(int senderId, int recipientId) {
        var chatId = ChatRoom.generateChatId(senderId, recipientId);
        ChatRoom senderRecipientRoom = ChatRoom.builder()
                .chatId(chatId)
                .sender(userRepository.findUserById(senderId))
                .recipient(userRepository.findUserById(recipientId))
                .build();
        ChatRoom recipientSenderRoom = ChatRoom.builder()
                .chatId(chatId)
                .sender(userRepository.findUserById(recipientId))
                .recipient(userRepository.findUserById(senderId))
                .build();
        chatRoomRepository.save(senderRecipientRoom);
        chatRoomRepository.save(recipientSenderRoom);
        return chatId;
    }
}
