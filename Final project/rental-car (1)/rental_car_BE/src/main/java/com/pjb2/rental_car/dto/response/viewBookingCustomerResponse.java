package com.pjb2.rental_car.dto.response;

import com.pjb2.rental_car.entity.Car;
import com.pjb2.rental_car.entity.CarImages;
import com.pjb2.rental_car.util.common.BookingStatus;
import com.pjb2.rental_car.util.common.CancelBookingStatus;
import com.pjb2.rental_car.util.common.CarOwnerStatus;
import com.pjb2.rental_car.util.common.DriverStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Driver;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
public class viewBookingCustomerResponse {
    //thiếu ảnh xe
    private List<String> carImg;
    private int id;
    private String name;
    private LocalDateTime from;
    private LocalDateTime to;
    private long numberOfDays;
    private double price;
    private double totalPrice;
    private double deposit;
    private int carId;
    private BookingStatus status;
    private DriverStatus driverStatus;
    private CarOwnerStatus carOwnerStatus;
    private int cancelBookingChoice;
    private CancelBookingStatus cancelBookingStatus;
    private String feedbackStatus;
    private double discount;
    public viewBookingCustomerResponse(
            int id,
            String name,
            LocalDateTime from,
            LocalDateTime to,
            double price,
            double deposit,
            BookingStatus status,
            int carId,
            List<String> carImg,
            DriverStatus driverStatus,
            CarOwnerStatus carOwnerStatus,
            int cancelBookingChoice,
            CancelBookingStatus cancelBookingStatus,
            String feedbackStatus,
            double discount
    ) {
        this.id = id;
        this.name = name;
        this.from = from;
        this.to = to;
        this.discount = discount;
        long fullDay = ChronoUnit.DAYS.between(from,to);
        this.numberOfDays = (fullDay <= 0) ? 1 : fullDay;
        this.price = price;
        this.totalPrice = (numberOfDays * price) - discount;
        this.deposit = deposit;
        this.status = status;
        this.carId = carId;
        this.carImg = carImg;
        this.driverStatus = driverStatus;
        this.carOwnerStatus = carOwnerStatus;
        this.cancelBookingChoice = cancelBookingChoice;
        this.cancelBookingStatus = cancelBookingStatus;
        this.feedbackStatus = feedbackStatus;
    }
}
