package com.pjb2.rental_car.dto.request;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class ChatMessagePayloadDTO {
    private String chatId;
    private int senderId;
    private int recipientId;
    private String content;
    private int numberOfAttachments;
    private List<String> listAttachments;
}
