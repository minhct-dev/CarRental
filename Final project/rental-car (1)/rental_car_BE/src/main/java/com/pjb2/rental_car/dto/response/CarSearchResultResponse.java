package com.pjb2.rental_car.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class CarSearchResultResponse {
    private int id;
    private String name;
    private String brand;
    private String model;
    private double rating;
    private int numberOfBookings;
    private String district;
    private String province;
    private String imageUrl;
    private String status;
    private double pricePerDay;
    private String fuelType;
    private String color;
    private String transmissionType;
    private String carType;
    private int productionYear;
    private String licensePlate;
    List<Map<String, String>> bookingPeriods;
    private int chair;

}
