package com.pjb2.rental_car.dto.response;

import lombok.*;

import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class SearchDriverResponse {
    private int userId;
    private String status;
    private String driverName;
    private int driverExp;
    private double price;
    private double lateFee;
    private Date dob;
    private String phoneNumber;
    private String email;
    private String nationalId;
    private List<String> drivingLicense;
    private ProvinceResponseDTO provinceCode;
    private DistrictResponseDTO districtCode;
    private WardResponseDTO wardCode;
    private String addressDetail;
    private int noOfBookings;
    private String avatarUrl;
}
