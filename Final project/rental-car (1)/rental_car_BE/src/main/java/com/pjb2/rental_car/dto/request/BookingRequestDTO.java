package com.pjb2.rental_car.dto.request;

import com.pjb2.rental_car.entity.District;
import com.pjb2.rental_car.entity.Province;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingRequestDTO {
    private String name;
    private Date dob;
    private String phone;
    private String email;
    private String nationalId;
    private double basePrice;
    private Date from;
    private Date to;
    private String provinceCode;
    private String districtCode;
    private String wardCode;
    private String addressDetail;
    private int carId;
    private int driverId;
}
