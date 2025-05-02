package com.pjb2.rental_car.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DriverListReponse {
    private String name;
    private String email;
    private String phone;
    private int exp;
    private double price;
    private double lateFee;

}
