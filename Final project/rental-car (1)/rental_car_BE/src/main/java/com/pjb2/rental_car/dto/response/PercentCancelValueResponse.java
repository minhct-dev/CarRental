package com.pjb2.rental_car.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PercentCancelValueResponse {
    private double percentTime;
    private double percentValue;
    private double totalRefund;
}
