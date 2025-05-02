package com.pjb2.rental_car.entity;


import com.pjb2.rental_car.util.common.*;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;


@EqualsAndHashCode(callSuper = true)
@Table(name = "booking")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Booking extends AbstractEntity {
    private String driverName;
    private String driverPhone;
    private Date driverDob;
    private String driverEmail;
    private String driverNationalId;
    private String driverLicenseFront;
    private String driverLicenseBack;

    private String addressDetail;
    private double basePrice;
    private double deposit;
    private Date startDate;
    private Date endDate;
    private Date actualTime;


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
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private User driver;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
    private WalletDeposit walletDeposit;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
    @JoinColumn(name = "wallet_id")
    private CancelBooking cancelBooking;

    @ManyToOne
    @JoinColumn(name = "carOwner_id")
    private User carOwner;
    @ManyToOne
    @JoinColumn(name = "car_id")
    private Car car;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private BookingStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "driver_status")
    private DriverStatus driverStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "car_owner_status")
    private CarOwnerStatus carOwnerStatus;

    private double driverFee;

    private double driverLateFee;

    private double carLateFee;

    private double discount;

    private int voucherId;
}
