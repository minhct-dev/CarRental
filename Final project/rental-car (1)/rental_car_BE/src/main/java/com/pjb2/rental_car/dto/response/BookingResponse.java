package com.pjb2.rental_car.dto.response;

import com.pjb2.rental_car.entity.Car;
import com.pjb2.rental_car.entity.CarImages;
import com.pjb2.rental_car.util.common.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
public class BookingResponse {
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

    public BookingResponse(
            int id,
            String name,
            LocalDateTime from, LocalDateTime to,
            double price, double deposit,
            BookingStatus status,
            int carId,List<String> carImg) {
        this.id = id;
        this.name = name;
        this.from = from;
        this.to = to;
        boolean hasRemainingTime = to.toLocalTime().isAfter(from.toLocalTime());
        long fullDay = ChronoUnit.DAYS.between(from,to);
        this.numberOfDays = fullDay + (hasRemainingTime ? 1 : 0);
        this.price = price;
        this.totalPrice = numberOfDays * price;
        this.deposit = deposit;
        this.status = status;
        this.carId = carId;
        this.carImg = carImg;
    }
}
