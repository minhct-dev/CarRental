package com.pjb2.rental_car.dto.response;

import com.pjb2.rental_car.entity.*;
import com.pjb2.rental_car.util.common.BookingStatus;
import com.pjb2.rental_car.util.common.CancelBookingStatus;
import com.pjb2.rental_car.util.common.CarOwnerStatus;
import com.pjb2.rental_car.util.common.DriverStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class BookingInfoResponse {
    //thiếu ảnh xe
    private String carName;
    private List<String> carImg;
    private int bookingId;
    private int userId;
    private String userAvatar;
    private String name;
    private String phone;
    private String email;
    private String nationalId;
    private Date dob;
    private LocalDateTime from;
    private LocalDateTime to;
    private long numberOfDays;
    private double price;
    private double totalPrice;
    private double discount;
    private double deposit;
    private int carId;
    private ProvinceResponseDTO province;
    private DistrictResponseDTO district;
    private WardResponseDTO ward;
    private String addressDetail;
    private String frontImg;
    private String backImg;
    private BookingStatus status;
    private DriverStatus driverStatus;
    private CarOwnerStatus carOwnerStatus;
    private CancelBookingStatus cancelBookingStatus;

    private int driverId;
    private double driverPrice;
    private String driverName;
    private String driverPhone;
    private String driverEmail;
    private String driverNationalId;
    private Date driverDob;
    private Double driverLateFee;
    private List<String> driveLicense;
    private ProvinceResponseDTO driverProvince;
    private DistrictResponseDTO driverDistrict;
    private WardResponseDTO driverWard;
    private String driverAddressDetail;



}
