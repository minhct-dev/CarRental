package com.pjb2.rental_car.entity;

import com.pjb2.rental_car.entity.District;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Ward {
    @Id
    @Column(name = "code", length = 5, nullable = false)
    private String code;

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "type", length = 30, nullable = false)
    private String type;

    @ManyToOne
    @JoinColumn(name = "district_code", nullable = false)
    private District district;
}
