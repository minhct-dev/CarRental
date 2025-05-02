package com.pjb2.rental_car.entity;

import com.pjb2.rental_car.util.common.CarImageType;
import com.pjb2.rental_car.util.common.SystemImageType;
import jakarta.persistence.*;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "system_images")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SystemImage extends AbstractEntity {
    private String imageUrl;
    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private SystemImageType type;
    @ManyToOne
    @JoinColumn(name = "voucher_id")
    private Voucher voucher;

}
