package com.pjb2.rental_car.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CarListBoxDTO {
    private int carId;
    private String carName;
    private String licensePlate;
}
