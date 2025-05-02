package com.pjb2.rental_car.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDetailResponse {
    private int id;
    private String name;
    private String nationalId;
    private String email;
    private String phone;
    private String addressDetail;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private Date dob;

    private String provinceName;
    private String districtName;
    private String wardName;
    private List<String> roles;
    private Double walletBalance;
    private String status;
    private String avatarUrl;
    private List<String> drivingLicenseUrl;
    private boolean banStatus;
    private int banDuration;
    private double price;
    private double lateFee;
    private int driverExp;
    private int draftId;
    private String draftStatus;
    private String draftRejectMessage;
    private String description;
}
