package com.pjb2.rental_car.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@AllArgsConstructor
@Data
@Setter
@Getter
public class ProvinceResponseDTO {
    private String code;
    private String name;
}
