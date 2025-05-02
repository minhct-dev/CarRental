package com.pjb2.rental_car.dto.response;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ListCarOwnerVoucherResponse {
    private int voucherId;
    private String name;
    private String status;
    private String code;
    private Date startDate;
    private Date endDate;
    private int quantity;
    private double percentRate;
    private double maxPrice;
    private double fixedPrice;
    private String type;
}
