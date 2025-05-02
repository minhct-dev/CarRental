package com.pjb2.rental_car.dto.response;

import lombok.*;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class MessagePageResponse extends PageResponseAbstract implements Serializable {
    private List<MessageDetailResponse> listMessages;
}
