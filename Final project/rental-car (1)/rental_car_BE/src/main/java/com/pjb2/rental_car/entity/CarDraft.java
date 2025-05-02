package com.pjb2.rental_car.entity;


import com.pjb2.rental_car.util.common.*;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "car_draf")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarDraft extends AbstractEntity {
    private String name;
    private String color;
    private String licencePlate;

    private int productionYear;
    private double mileage;
    private int noOfSeats;
    @Enumerated(EnumType.STRING)
    @Column(name = "transmission_type")
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
    private String rejectMessage;

    private Boolean isDeleted = false;
    @Enumerated(EnumType.STRING)
    private CarDraftType type;
    @Enumerated(EnumType.STRING)
    private CarDraftStatus status;
    private int step;

    @ManyToOne
    @JoinColumn(name = "province_code")
    private Province province;

    @ManyToOne
    @JoinColumn(name = "district_code")
    private District district;

    @ManyToOne
    @JoinColumn(name = "ward_code")
    private Ward ward;

    @ManyToOne
    @JoinColumn(name = "model_id")
    private CarModel carModel;

    @ManyToOne
    @JoinColumn(name = "car_type_id")
    private CarType carType;

    @OneToMany(mappedBy = "carDraft")
    private List<CarTermOfUse> carTermOfUses;

    @OneToMany(mappedBy = "carDraft")
    private List<CarImages> carImages;

    @OneToMany(mappedBy = "carDraft")
    private List<CarFunction> carFunctions;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne
    @JoinColumn(name = "car_id")
    private Car car;


}
