package com.pjb2.rental_car.controller;

import com.pjb2.rental_car.dto.request.ChatIdDTO;
import com.pjb2.rental_car.dto.request.ChatMessageRequestDTO;

import com.pjb2.rental_car.dto.response.ChatBoxResponse;
import com.pjb2.rental_car.dto.response.MessagePageResponse;
import com.pjb2.rental_car.dto.response.ResponseSuccess;
import com.pjb2.rental_car.entity.ChatMessage;
import com.pjb2.rental_car.exception.ApiException;
import com.pjb2.rental_car.service.ChatService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Controller
@Tag(name = "Chat box Controller")
@RequiredArgsConstructor
public class ChatSocketController {
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    @MessageMapping("/subscribe")
    public void handleSubscription(@Payload String topic) {
        System.out.println(topic);
        messagingTemplate.convertAndSend(topic, topic);
    }
    @MessageMapping("/chat")
    public ResponseSuccess<Integer> processMessage(@Header(name = "Authorization") String token, @Payload ChatMessageRequestDTO chatMessage) throws ApiException {
        ChatMessage savedChatMessage = chatService.saveMessages(token,chatMessage);
        return new ResponseSuccess<>(HttpStatus.OK.value(), "Send message successfully", savedChatMessage.getId());
    }
    @MessageMapping("/seen")
    public ResponseSuccess handleSeenMessage(@Header(name = "Authorization") String token,@Payload ChatIdDTO chatId) throws ApiException {
        chatService.seenMessage(token,chatId);
        return new ResponseSuccess<>(HttpStatus.OK.value(), "Seen message successfully", null);
    }

}
