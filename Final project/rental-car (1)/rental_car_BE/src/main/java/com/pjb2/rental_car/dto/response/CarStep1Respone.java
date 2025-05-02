package com.pjb2.rental_car.dto.response;

import com.pjb2.rental_car.util.EnumValue;
import com.pjb2.rental_car.util.common.FuelType;
import com.pjb2.rental_car.util.common.TransmissionType;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;


@Getter
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class CarStep1Respone {
    private int carDraftId;
    private String licencePlate;
    private String color;
    private int carBrandId;
    private int carModelId;
    private int productionYear;
    private int noOfSeats;
    private TransmissionType transmissionType;
    private FuelType fuelType;
    private List<String> registration;
    private List<String> certificate;
    private List<String> insurance;
    private int carTypeId;
}
