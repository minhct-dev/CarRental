package com.pjb2.rental_car.dto.response;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class DriverDetailRespone {

    private Double late_fee;
    private Double price;
    private int driver_exp;
}
