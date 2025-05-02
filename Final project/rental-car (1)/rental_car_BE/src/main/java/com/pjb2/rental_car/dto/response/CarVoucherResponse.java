package com.pjb2.rental_car.dto.response;

import com.pjb2.rental_car.entity.CarBrand;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CarVoucherResponse {
    private int voucherId;
    private String name;
    private double maxPrice;
    private double percentRate;
    private double fixedPrice;
    private int remainDays;
    private String code;
    private String description;
    private boolean usable;
}
