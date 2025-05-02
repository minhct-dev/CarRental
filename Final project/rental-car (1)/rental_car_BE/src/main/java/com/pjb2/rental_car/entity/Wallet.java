package com.pjb2.rental_car.entity;


import com.pjb2.rental_car.util.common.UserWalletType;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Table(name = "wallet")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Wallet extends AbstractEntity {
    private double balance;

    @OneToMany(mappedBy = "wallet")
    private List<WalletHistory> history;

    @Enumerated(EnumType.STRING)
    private UserWalletType walletType;
}
