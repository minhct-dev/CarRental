package com.pjb2.rental_car.entity;

import com.pjb2.rental_car.util.common.CarImageType;
import jakarta.persistence.*;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "car_images")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CarImages extends AbstractEntity {
    private String imageUrl;
    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private CarImageType type;

    @ManyToOne
    @JoinColumn(name = "car_id")
    private Car car;

    @ManyToOne
    @JoinColumn(name = "car_draft_id")
    private CarDraft carDraft;


}
