package com.pjb2.rental_car.dto.request;

import com.pjb2.rental_car.util.EnumValue;
import com.pjb2.rental_car.util.common.FuelType;
import com.pjb2.rental_car.util.common.TransmissionType;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CarDraftEditRequest {
    @NotBlank(message = "Licence plate can not be blanked")
    @Pattern(regexp = "^([1-9][0-9])([A-Z]?)-([0-9]{5}|[0-9]{2,3}\\.[0-9]{2,5})$" , message = "License plate is not valid (XXX-XXX.XX)")
    private String licencePlate;
    @NotBlank(message = "Color can not be blanked")
    private String color;
    @NotNull(message = "Id can not be null")
    @Min(value = 1,message = "Invalid car brand id")
    private int carBrandId;
    @NotNull(message = "Id can not be null")
    @Min(value = 1,message = "Invalid car model id")
    private int carModelId;
    @NotNull(message = "Production year can not be null")
    @Max(value = 2030, message = "Production year can not >2030")
    @Min(value = 1990, message = "Production year can not <1990")
    private int productionYear;
    @NotNull(message = "No of seats can not be null")
    @Min(value = 1,message = "noOfSeat can not < 1 ")
    private int noOfSeats;
    @EnumValue(name="transmission_type" ,enumClass = TransmissionType.class)
    private String transmissionType;
    @EnumValue(name="fuel_type", enumClass = FuelType.class)
    private String fuelType;
    @NotNull(message = "Car type id can not be null")
    @Min(value = 1,message = "cartypeId can not < 1 ")
    private int carTypeId;
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
    @NotNull(message = "base price can not null")
    @Min(value = 1, message = "invalid base price")
    private double basePrice;
    @NotNull(message = "deposit can not null")
    @Min(value = 1, message = "invalid deposit")
    private double deposit;
    List<String> carTermOfUse;
    @NotNull(message = "Late fee can not null")
    @Min(value=1,message = "late fee can not <1")
    private double lateFee;
}
