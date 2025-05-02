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
@ToString
public class FeedbackReportResponse {
    private String carImg;
    private String carName;
    private Date startBookingDate;
    private Date endBookingDate;
    private String comment;
    private Double rating;
    private String userName;
    private String userImg;
    private LocalDateTime dateOfRating;


}
