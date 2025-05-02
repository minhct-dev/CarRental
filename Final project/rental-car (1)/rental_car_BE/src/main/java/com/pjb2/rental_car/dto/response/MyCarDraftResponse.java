package com.pjb2.rental_car.dto.response;

import lombok.*;

import java.util.List;
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class MyCarDraftResponse {
    private int draftId;
    private List<String> carImagesUrl;
    private String brand;
    private String model;
    private double rating;
    private int noOfRides;
    private double basePrice;
    private String province;
    private String district;
    private String type;
    private String status;
}
