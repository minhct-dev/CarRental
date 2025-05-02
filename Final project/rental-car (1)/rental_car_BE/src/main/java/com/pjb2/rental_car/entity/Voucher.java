package com.pjb2.rental_car.entity;

import com.pjb2.rental_car.util.common.VoucherScope;
import com.pjb2.rental_car.util.common.VoucherStatus;
import com.pjb2.rental_car.util.common.VoucherType;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "voucher")
public class Voucher extends AbstractEntity {
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String name;
    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "voucher_scope")
    private VoucherScope scope;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private VoucherType type;

    @ManyToMany
    @JoinTable(
            name = "voucher_car",
            joinColumns = @JoinColumn(name = "voucher_id"),
            inverseJoinColumns = @JoinColumn(name = "car_id")
    )
    private List<Car> cars;

    private Date startDate;
    private Date endDate;
    @Column(nullable = true)
    private Integer quantity;
    private double percentRate;
    private double maxPrice;
    private double fixedPrice;
    private String code;
    private boolean isDeleted;
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private VoucherStatus status;
    //admin voucher ---------------------------------
    @OneToMany(mappedBy = "voucher")
    private List<SystemImage> systemImages;
    @ManyToOne
    @JoinColumn(name = "brand_id")
    private CarBrand brand;
    @ManyToMany
    @JoinTable(
            name = "voucher_model",
            joinColumns = @JoinColumn(name = "voucher_id"),
            inverseJoinColumns = @JoinColumn(name = "model_id")
    )
    private List<CarModel> models;
    private boolean isHomepageDisplay;


}
