package com.pjb2.rental_car.entity;

import com.pjb2.rental_car.entity.District;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "provinces")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Province {
    @Id
    @Column(name = "code", length = 5, nullable = false)
    private String code;

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "type", length = 30, nullable = false)
    private String type;

    @Column(name = "slug", length = 30)
    private String slug;

    @OneToMany(mappedBy = "province", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<District> districts;
}
