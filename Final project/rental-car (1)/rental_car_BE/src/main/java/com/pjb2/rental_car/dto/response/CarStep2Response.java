package com.pjb2.rental_car.dto.response;

import com.pjb2.rental_car.entity.CarFunction;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class CarStep2Response {
    private double mileage;
    private double fuelConsumption;
    private String provinceCode;
    private String districtCode;
    private String wardCode;
    private String addressDetails;
    private String description;
    private List<Integer> carFunctionsId;
    private List<String> carImages;
}
