package com.pjb2.rental_car.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class IncomeDTO {
    private Double balance;
    private Double changePercentage;
}
