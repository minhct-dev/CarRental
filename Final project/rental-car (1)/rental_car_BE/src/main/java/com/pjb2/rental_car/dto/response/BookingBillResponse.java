package com.pjb2.rental_car.dto.response;

import com.pjb2.rental_car.util.common.BookingStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class BookingBillResponse {
    private int id;
    private double basePrice;
    private double deposit;
    private long numberOfDays;
    private double car_late_fee;
    private double total_car_fee;
    private double driver_late_fee;
    private double total_driver_fee;
    private double discount;
    private String userName;
    private String userPhone;
    private String userEmail;
    private String nationalId;
    private LocalDateTime from;
    private LocalDateTime to;
    private String created_At;
    private BookingStatus status;
    private String carName;
    private String actualTime;
    private String driverName;
    private String driverEmail;
    private String driverPhone;

}
