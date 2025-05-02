package com.pjb2.rental_car.dto.response;

import com.pjb2.rental_car.util.common.CarStatus;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CarStep4Response {
    private double basePrice;
    private String carName;
    private String location;
}
