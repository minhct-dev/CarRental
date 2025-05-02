package com.pjb2.rental_car.dto.response;

import com.pjb2.rental_car.entity.CarImages;
import lombok.*;

import java.util.List;
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class MyCarResponse {
    private int carId;
    private List<String> carImagesUrl;
    private String brand;
    private String licensePlate;
    private String model;
    private double rating;
    private int noOfRides;
    private double basePrice;
    private String province;
    private String district;
    private String status;
}
