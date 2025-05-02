package com.pjb2.rental_car.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CarRequestResponse {
    private int draftId;
    private String carImgUrl;
    private String carName;
    private String userName;
    private LocalDateTime requestTime;
    private String type;
    private String status;
    private String rejectMessage;

}
