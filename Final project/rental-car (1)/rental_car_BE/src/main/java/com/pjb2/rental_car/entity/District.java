package com.pjb2.rental_car.entity;

import com.pjb2.rental_car.entity.Province;
import com.pjb2.rental_car.entity.Ward;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "districts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class District {
    @Id
    @Column(name = "code", length = 5, nullable = false)
    private String code;

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "type", length = 30, nullable = false)
    private String type;

    @ManyToOne
    @JoinColumn(name = "province_code", nullable = false)
    private Province province;

    @OneToMany(mappedBy = "district", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Ward> wards;
}
