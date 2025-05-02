package com.pjb2.rental_car.dto.request;

import com.pjb2.rental_car.entity.CarTermOfUse;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CarStep3Request {
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
