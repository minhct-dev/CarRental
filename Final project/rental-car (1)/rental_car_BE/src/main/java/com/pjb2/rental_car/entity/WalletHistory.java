package com.pjb2.rental_car.entity;


import com.pjb2.rental_car.util.common.WalletHistoryType;
import jakarta.persistence.*;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Table(name = "wallet_history")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WalletHistory extends AbstractEntity {
    private double amount;
    @Enumerated(EnumType.STRING)
    private WalletHistoryType type;
    @ManyToOne
    @JoinColumn(name = "wallet_id")
    private Wallet wallet;
    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;
    private String note;
}
