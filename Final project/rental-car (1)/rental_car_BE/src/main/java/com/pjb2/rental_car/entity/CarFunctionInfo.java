package com.pjb2.rental_car.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "car_function_info")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CarFunctionInfo extends AbstractEntity{
    private String name;
    private String icon;
}
