package com.pjb2.rental_car.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class MessageDetailResponse {
    private String chatId;
    private int senderId;
    private String senderName;
    private String senderAvatar;
    private String content;
    private List<String> listAttachmentsUrl;
    private LocalDateTime createdAt;
}
