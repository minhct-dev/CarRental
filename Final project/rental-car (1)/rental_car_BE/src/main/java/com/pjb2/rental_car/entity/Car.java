package com.pjb2.rental_car.entity;


import com.pjb2.rental_car.util.common.CarStatus;
import com.pjb2.rental_car.util.common.FuelType;
import com.pjb2.rental_car.util.common.TransmissionType;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;


@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "car")
public class Car extends AbstractEntity {
    private String name;
    private String color;
    private String licencePlate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private CarStatus status;

    private int productionYear;
    private double mileage;

    private boolean isDeleted;
    @Enumerated(EnumType.STRING)
    @Column(name = "transmisson_type")
    private TransmissionType transmissionType;

    @Enumerated(EnumType.STRING)
    @Column(name = "fuel_type")
    private FuelType fuelType;

    private double fuelConsumption;
    private double deposit;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    private double basePrice;
    private String addressDetail;
    private int noOfSeats;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "car")
    private List<Feedback> feedbacks;
    @ManyToOne
    @JoinColumn(name = "model_id")
    private CarModel carModel;

    @ManyToOne
    @JoinColumn(name = "car_type_id")
    private CarType carType;

    @OneToMany(mappedBy = "car")
    private List<Booking> bookings;
    @OneToMany(mappedBy = "car")
    private List<CarTermOfUse> carTermOfUses;

    @OneToMany(mappedBy = "car")
    private List<CarImages> carImages;

    @OneToMany(mappedBy = "car")
    private List<CarFunction> carFunctions;

    @ManyToOne
    @JoinColumn(name = "province_code")
    private Province province;

    @ManyToOne
    @JoinColumn(name = "district_code")
    private District district;

    @ManyToOne
    @JoinColumn(name = "ward_code")
    private Ward ward;

    @ManyToMany(mappedBy = "cars")
    private List<Voucher> vouchers;

}
