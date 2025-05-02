package com.pjb2.rental_car.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class NotificationResponseDTO {
    private String chatId;
    private String avatarUrl;
    private String name;
    private String content;
    private int noOfAttachment;
    private String type;
}
