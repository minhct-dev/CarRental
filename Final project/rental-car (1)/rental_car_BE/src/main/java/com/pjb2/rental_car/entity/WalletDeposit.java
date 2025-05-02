package com.pjb2.rental_car.entity;

import com.pjb2.rental_car.util.common.WalletDepositStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "wallet_deposit")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WalletDeposit extends AbstractEntity {
    private double depositAmount;
    @Enumerated(EnumType.STRING)
    private WalletDepositStatus status;
    @OneToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;
}
