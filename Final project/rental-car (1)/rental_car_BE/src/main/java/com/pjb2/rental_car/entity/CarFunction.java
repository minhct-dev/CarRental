package com.pjb2.rental_car.entity;

import jakarta.persistence.*;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "car_function")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CarFunction extends AbstractEntity{
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "car_function_info_id")
    private CarFunctionInfo carFunctionInfo;

    @ManyToOne
    @JoinColumn(name = "car_id")
    private Car car;

    @ManyToOne
    @JoinColumn(name = "car_draft_id")
    private CarDraft carDraft;

    public CarFunction(CarFunctionInfo carFunctionInfo, CarDraft carDraft) {
        this.carFunctionInfo = carFunctionInfo;
        this.carDraft = carDraft;
    }
    public CarFunction(CarFunctionInfo carFunctionInfo, Car car) {
        this.carFunctionInfo = carFunctionInfo;
        this.car = car;
    }
}
