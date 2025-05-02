package com.pjb2.rental_car.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResetUserDTO {
    @NotBlank(message = "token is invalid")
    private String token;
    @NotBlank(message = "newPassword is not blank")
    private String newPassword;
}
