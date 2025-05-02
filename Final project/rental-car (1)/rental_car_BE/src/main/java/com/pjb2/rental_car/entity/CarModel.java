package com.pjb2.rental_car.entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "car_model")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CarModel extends AbstractEntity {
    private String name;

    @ManyToOne
    @JoinColumn(name = "brand_id")
    private CarBrand brand;

    @ManyToMany(mappedBy = "models")
    private List<Voucher> vouchers;
}
