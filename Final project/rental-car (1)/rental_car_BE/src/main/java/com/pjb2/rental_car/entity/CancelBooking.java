package com.pjb2.rental_car.entity;

import com.pjb2.rental_car.util.common.CancelBookingStatus;
import com.pjb2.rental_car.util.common.WalletDepositStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cancel_booking")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CancelBooking extends AbstractEntity {
    private int choice;
    @Enumerated(EnumType.STRING)
    private CancelBookingStatus status;
    @OneToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;



}
