package com.pjb2.rental_car.dto.response;

import com.pjb2.rental_car.entity.CarFunctionInfo;
import com.pjb2.rental_car.entity.CarType;
import com.pjb2.rental_car.util.common.CarDraftStatus;
import com.pjb2.rental_car.util.common.CarDraftType;
import com.pjb2.rental_car.util.common.FuelType;
import com.pjb2.rental_car.util.common.TransmissionType;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CarRequestDetailResponse {
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
    private String provinceName;
    private String districtName;
    private String wardName;
    private CarModelDTO carModel;
    private CarBrandDTO carBrand;
    private CarType carType;
    private List<String> carTermOfUses;
    private List<CarImagesDTO> carImages;
    private List<CarFunctionInfo> carFunctions;
    private Double lateFee;
}
