package com.pjb2.rental_car.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CarModelDTO {
    private int id;
    private String name;
}
