package com.pjb2.rental_car.dto.response;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class VoucherHomepageResponse {
    private int voucherId;
    private String voucherImageUrl;
    private String name;
    private String description;
    private Date startDate;
    private Date endDate;
    private double fixedPrice;
    private double percentRate;
    private double maxPrice;


}
