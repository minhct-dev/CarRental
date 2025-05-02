package com.pjb2.rental_car.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class WalletTransactionDTO {
    double amount;
    String note;
}
