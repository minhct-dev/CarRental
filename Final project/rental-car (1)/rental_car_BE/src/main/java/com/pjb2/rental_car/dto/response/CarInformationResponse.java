package com.pjb2.rental_car.dto.response;

import com.pjb2.rental_car.entity.CarType;
import com.pjb2.rental_car.util.common.*;
import lombok.*;

import java.util.List;
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CarInformationResponse {
    private String name;
    private String color;
    private String licencePlate;
    private int noOfRides;
    private int productionYear;
    private double mileage;
    private int noOfSeats;
    private TransmissionType transmissionType;
    private String location;
    private FuelType fuelType;
    private Double rating;
    private int noOfRatings;
    private double fuelConsumption;
    private double deposit;
    private String description;
    private double basePrice;
    private String addressDetail;
    private CarStatus status;
    private String provinceCode;
    private String districtCode;
    private String wardCode;
    private CarModelDTO carModel;
    private CarBrandDTO carBrand;
    private CarType carType;
    private List<String> carTermOfUses;
    private List<CarImagesDTO> carImages;
    private List<Integer> carFunctionsId;
    private Double lateFee;
}
