package com.pjb2.rental_car.dto.response;

import com.pjb2.rental_car.entity.CarTermOfUse;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class CarStep3Response {
    private double basePrice;
    private double deposit;
    List<String> carTermOfUse;
}
