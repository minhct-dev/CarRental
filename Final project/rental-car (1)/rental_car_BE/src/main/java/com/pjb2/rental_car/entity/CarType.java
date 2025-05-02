package com.pjb2.rental_car.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "car_type")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CarType extends AbstractEntity {
    private String name;
}
