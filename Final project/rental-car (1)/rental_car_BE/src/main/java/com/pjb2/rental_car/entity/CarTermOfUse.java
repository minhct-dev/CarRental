package com.pjb2.rental_car.entity;

import com.pjb2.rental_car.util.common.TermOfUseType;
import com.pjb2.rental_car.util.common.TransmissionType;
import jakarta.persistence.*;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "car_term_of_use")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarTermOfUse extends AbstractEntity {
    private String term;

    @Enumerated(EnumType.STRING)
    @Column(name = "term_type")
    private TermOfUseType termOfUseType;

    @ManyToOne
    @JoinColumn(name = "car_id")
    private Car car;
    @ManyToOne
    @JoinColumn(name = "car_draft_id")
    private CarDraft carDraft;
    private Double value;
    public CarTermOfUse(String term, CarDraft carDraft,TermOfUseType termOfUseType) {
        this.term = term;
        this.carDraft = carDraft;
        this.termOfUseType = termOfUseType;
    }
    public CarTermOfUse(CarDraft carDraft,TermOfUseType termOfUseType,Double value) {
        this.carDraft = carDraft;
        this.termOfUseType = termOfUseType;
        this.value = value;
    }
    public CarTermOfUse(String term, Car car,TermOfUseType termOfUseType) {
        this.term = term;
        this.car = car;
        this.termOfUseType = termOfUseType;
    }
    public CarTermOfUse(Car car,TermOfUseType termOfUseType,Double value) {
        this.car = car;
        this.termOfUseType = termOfUseType;
        this.value = value;
    }
}
