package com.pjb2.rental_car.dto.response;

import com.pjb2.rental_car.entity.CancelBooking;
import com.pjb2.rental_car.entity.WalletDeposit;
import com.pjb2.rental_car.util.common.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
@Getter
@Setter
@NoArgsConstructor
public class CarOwnerBookingResponse {
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
    private String ownerName;
    private String ownerEmail;
    private double walletDepositAmount;
    private WalletDepositStatus walletDepositStatus;
    private int cancel_Booking_choice;
    private CancelBookingStatus cancelBookingStatus;
    private BookingStatus statusBooking;
    private DriverStatus driver_status;
    private CarOwnerStatus carOwnerStatus;
    private double discount;
    private double serviceFee;
    public CarOwnerBookingResponse(
            int id,
            String name,
            LocalDateTime from, LocalDateTime to,
            double price, double deposit,
            BookingStatus status,
            int carId,String ownerName,String ownerEmail,
            List<String> carImg,
            double walletDepositAmount, WalletDepositStatus walletDepositStatus,
            int cancel_Booking_choice, CancelBookingStatus cancelBookingStatus,
            DriverStatus driver_status,
            CarOwnerStatus carOwnerStatus,
            double discount
            ) {
        this.id = id;
        this.name = name;
        this.from = from;
        this.to = to;
        boolean hasRemainingTime = to.toLocalTime().isAfter(from.toLocalTime());
        long fullDay = ChronoUnit.DAYS.between(from,to);
        this.numberOfDays = (fullDay <= 0 ) ? 1 : fullDay ;
        this.price = price;
        this.discount = discount;
        this.totalPrice = numberOfDays * price;
        this.deposit = deposit;
        this.statusBooking = status;
        this.carId = carId;
        this.ownerName = ownerName;
        this.ownerEmail = ownerEmail;
        this.carImg = carImg;
        this.walletDepositAmount = walletDepositAmount;
        this.walletDepositStatus = walletDepositStatus;
        this.cancel_Booking_choice = cancel_Booking_choice;
        this.cancelBookingStatus = cancelBookingStatus;
        this.carOwnerStatus = carOwnerStatus;
        this.driver_status = driver_status;
        this.serviceFee = (totalPrice - discount) * 0.03;
    }
}
