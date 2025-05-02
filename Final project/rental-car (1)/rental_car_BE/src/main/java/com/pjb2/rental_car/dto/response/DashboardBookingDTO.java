package com.pjb2.rental_car.dto.response;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class DashboardBookingDTO {
    private int bookingId;
    private String carName;
    private String licensePlate;
    private Date startDate;
    private Date endDate;
    private Double profit;
}
