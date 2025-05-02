package com.pjb2.rental_car.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.*;
import org.springframework.boot.autoconfigure.amqp.AbstractRabbitListenerContainerFactoryConfigurer;

import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "car_brand")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CarBrand extends AbstractEntity {
    private String name;

    @OneToMany(mappedBy = "brand")
    List<CarModel> carModels = new ArrayList<CarModel>();

    @OneToMany(mappedBy = "brand")
    List<Voucher> vouchers = new ArrayList<>();
}
