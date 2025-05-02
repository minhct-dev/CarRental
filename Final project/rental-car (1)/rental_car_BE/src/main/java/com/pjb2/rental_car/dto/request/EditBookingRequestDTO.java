package com.pjb2.rental_car.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EditBookingRequestDTO {
    private String name;
    private Date dob;
    private String phone;
    private String nationalId;
    private String provinceCode;
    private String districtCode;
    private String wardCode;
    private String addressDetail;
    private int carId;
    private Integer driverId;
}
