package com.pjb2.rental_car.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.pjb2.rental_car.entity.User;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CarSearchRequestDTO {

    private String provinceCode;
    private String districtCode;
    private String wardCode;

    @Future(message = "Pickup date must be in the future")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm", timezone = "Asia/Ho_Chi_Minh")
    private Date pickupDate;

    @Future(message = "Dropoff date must be in the future")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm", timezone = "Asia/Ho_Chi_Minh")
    private Date dropoffDate;

    private String name;
    private Integer brandId;
    private List<Integer> modelId;
    private List<String> fuelType;
    private List<String> color;
    private List<String> transmissionType;

    @Min(value = 0, message = "Minimum price must be greater than or equal to 0")
    private double minPrice;

    @Min(value = 0, message = "Maximum price must be greater than or equal to 0")
    private double maxPrice;

    @Min(value = 1, message = "Page size must be at least 1")
    private int pageSize = 10;
    private int pageNumber;
}
