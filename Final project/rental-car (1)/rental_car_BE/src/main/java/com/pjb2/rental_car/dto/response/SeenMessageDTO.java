package com.pjb2.rental_car.dto.response;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class SeenMessageDTO {
    private int numberOfSeenMessages;
    private String type;
}
