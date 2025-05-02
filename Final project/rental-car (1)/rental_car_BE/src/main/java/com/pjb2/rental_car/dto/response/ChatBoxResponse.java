package com.pjb2.rental_car.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ChatBoxResponse {
    private String chatId;
    private String RecipientName;
    private int RecipientId;
    private String recipientAvatarUrl;
    private String latestMessage;
    private int messageSenderId;
    private int numberOfAttachments;
    private String status;
    private LocalDateTime created_at;
}
