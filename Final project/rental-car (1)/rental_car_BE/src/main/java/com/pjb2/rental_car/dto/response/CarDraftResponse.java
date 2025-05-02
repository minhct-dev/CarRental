package com.pjb2.rental_car.dto.response;

import com.pjb2.rental_car.entity.*;
import com.pjb2.rental_car.util.common.CarDraftStatus;
import com.pjb2.rental_car.util.common.CarDraftType;
import com.pjb2.rental_car.util.common.FuelType;
import com.pjb2.rental_car.util.common.TransmissionType;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CarDraftResponse {
    private int id;
    private String name;
    private String color;
    private String licencePlate;

    private int productionYear;
    private double mileage;
    private int noOfSeats;
    private TransmissionType transmissionType;

    private FuelType fuelType;

    private double fuelConsumption;
    private double deposit;
    private String description;
    private double basePrice;
    private String addressDetail;


    private CarDraftType type;
    private CarDraftStatus status;
    private int step;
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
    private String rejectMessage;
}
