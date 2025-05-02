package com.pjb2.rental_car.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class DriverUpdateRequest {
    @NotNull(message = "late_fee can not be null")
    @Min(value = 1,message = "late_fee must more than 1")
    private double late_fee;
    @NotNull(message = "price can not be null")
    @Min(value = 1,message = "price must more than 1")
    private double price;
    @NotNull(message = "driver_exp can not be null")
    @Min(value = 0,message = "driver_exp must more than 0 ")
    private int driver_exp;
}
