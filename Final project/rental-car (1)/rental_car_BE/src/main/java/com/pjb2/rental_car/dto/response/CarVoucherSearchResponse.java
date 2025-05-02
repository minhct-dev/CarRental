package com.pjb2.rental_car.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CarVoucherSearchResponse {
    private int voucherId;
    private String name;
    private double maxPrice;
    private double percentRate;
    private double fixedPrice;
    private int remainDays;
    private String code;
    private String description;
    private CarBrandDTO carBrand;
    private List<CarModelDTO> listModels;
    private boolean usable;
}
