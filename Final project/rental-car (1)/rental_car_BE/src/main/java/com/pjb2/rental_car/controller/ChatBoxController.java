package com.pjb2.rental_car.controller;

import com.pjb2.rental_car.dto.response.*;
import com.pjb2.rental_car.exception.ApiException;
import com.pjb2.rental_car.service.ChatService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/chat-box")
@Tag(name = "Chat box Controller")
@RequiredArgsConstructor
public class ChatBoxController {
    private final ChatService chatService;
    @PostMapping("/save-attachments")
    public ResponseSuccess<List<String>> saveImages(@RequestPart List<MultipartFile> attachments) throws ApiException, IOException {
        return new ResponseSuccess<>(HttpStatus.OK.value(), "save attachment successfully", chatService.saveMessageAttachments(attachments));
    }
    @GetMapping("/list-chat-box")
    public ResponseSuccess<List<ChatBoxResponse>> getListChatBoxResponse(@RequestHeader(name = "Authorization") String token) throws ApiException {

        return new ResponseSuccess<>(HttpStatus.OK.value(), "Get list chat box response", chatService.getListChatBoxResponse(token));
    }
    @GetMapping("/history-message")
    public ResponseSuccess<MessagePageResponse> getHistoryMessage(@RequestParam String chatId, @RequestParam(required = false) String sort, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) throws ApiException {
        return new ResponseSuccess<>(HttpStatus.OK.value(), "get list history success",chatService.getMessagePageResponse(chatId,sort,page,size));
    }

    @GetMapping("/check-existed-chat")
    public ResponseSuccess<ChatBoxResponse> checkExistedChat(@RequestHeader(name = "Authorization") String token, @RequestParam int carOwnerId) throws ApiException {
        return new ResponseSuccess<>(HttpStatus.OK.value() , "Check exist success" , chatService.checkExistChatBox(token,carOwnerId));
    }

    @GetMapping("/list-notification")
    public ResponseSuccess<List<NotificationResponseDTO>> getListNotificationResponse(@RequestHeader(name = "Authorization") String token) throws ApiException {

        return new ResponseSuccess<>(HttpStatus.OK.value(), "get list notification success",chatService.getNotificationResponse(token));
    }
}
