package com.pjb2.rental_car.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.pjb2.rental_car.util.common.UserStatus;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Getter
@Setter
public class UserRequestDTO {
    @NotBlank(message = "Name must not be blank")
    private String name;

    @NotBlank(message = "National ID must not be blank")
    @Pattern(regexp = "^0\\d{11}$", message = "National ID must be 12 digits and start with 0")
    private String nationalId;

    @NotBlank(message = "Phone number must not be blank")
    @Pattern(regexp = "^\\d{10}$", message = "Phone number format is invalid")
    private String phone;

    @NotNull(message = "Date of birth must not be null")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date dob;

    @NotBlank(message = "Province code must not be blank")
    private String provinceCode;

    @NotBlank(message = "District code must not be blank")
    private String districtCode;

    @NotBlank(message = "Ward code must not be blank")
    private String wardCode;

    @NotBlank(message = "Address detail must not be blank")
    private String addressDetail;
    @Min(value = 0, message = "Price must be greater than or equal to 0")
    private Double price;

    @Min(value = 0, message = "Late fee must be greater than or equal to 0")
    private Double lateFee;

    @Min(value = 0, message = "Driver experience must be greater than or equal to 0")
    private Integer driverExp;

    private String description;
}
