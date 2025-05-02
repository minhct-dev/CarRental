package com.pjb2.rental_car.dto.response;

import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ReportResponse {
    private String userName;
    private Double rating;
    private String date;
    private String comment;
    private String carName;
    private int carId;
}
