package com.pjb2.rental_car.service;

import com.pjb2.rental_car.dto.request.ChatIdDTO;
import com.pjb2.rental_car.dto.request.ChatMessageRequestDTO;

import com.pjb2.rental_car.dto.response.ChatBoxResponse;
import com.pjb2.rental_car.dto.response.MessagePageResponse;
import com.pjb2.rental_car.dto.response.NotificationResponseDTO;
import com.pjb2.rental_car.entity.ChatMessage;
import com.pjb2.rental_car.exception.ApiException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ChatService {
    //method to save sent_message db
    ChatMessage saveMessages(String token , ChatMessageRequestDTO chatMessageRequestDTO)throws ApiException;
    //method to save message_attachment to db
    List<String> saveMessageAttachments(List<MultipartFile> listAttachment)throws ApiException, IOException;
    //method to get list chat box
    List<ChatBoxResponse> getListChatBoxResponse(String token) throws ApiException;
    //method to get chat history
    MessagePageResponse getMessagePageResponse(String chatId,String sort, int page, int size) throws ApiException;
    //method to check if user and car owner has box chat or not
    ChatBoxResponse checkExistChatBox(String token, int recipientId) throws ApiException;
    //method to seen message
    void seenMessage(String token, ChatIdDTO chatId) throws ApiException;
    //method to get list notification
    List<NotificationResponseDTO> getNotificationResponse(String token) throws ApiException;

}
