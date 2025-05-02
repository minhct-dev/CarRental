package com.pjb2.rental_car.dto.request;

import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class ChatMessageRequestDTO {
    private int recipientId;
    private String content;
    //private List<String> listAttachmentUrl;
}
