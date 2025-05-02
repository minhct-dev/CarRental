package com.pjb2.rental_car.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CarFeedbackResponse {
    private String name;
    private String imageUrl;
    private String comment;
    private Double rating;
    private LocalDateTime feedbackDate;

}
