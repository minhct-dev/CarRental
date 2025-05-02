package com.pjb2.rental_car.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class DetailInformationEditRequest {
    @NotNull(message = "mileage can not null")
    @Min(1)
    private double mileage;
    @Min(value = 0, message = "invalid fuel consumption")
    private double fuelConsumption;
    @NotBlank(message = "invalid province")
    private String provinceCode;
    @NotBlank(message = "invalid district")
    private String districtCode;
    @NotBlank(message = "invalid ward")
    private String wardCode;
    @NotBlank(message = "address details can not blank")
    private String addressDetails;
    private String description;
    private List<Integer> carFunctionsId;
    //list image
}
