package com.pjb2.rental_car.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class VoucherDetailResponse {
    private String name;
    private String description;
    private String scope;
    private String startDate;
    private String endDate;
    private Integer quantity;
    private double percentRate;
    private double maxPrice;
    private double fixedPrice;
    private String code;
    private String status;
    private String imageUrl;
    private List<Integer> listCarId;
    private int brandId;
    private List<Integer> listModelId;
}
