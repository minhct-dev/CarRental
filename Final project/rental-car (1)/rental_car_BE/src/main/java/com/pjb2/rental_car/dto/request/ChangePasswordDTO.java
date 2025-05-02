package com.pjb2.rental_car.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordDTO {
    private String currentPassword;

    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[\\W_]).{6,}$",
            message = "New password must have at least one uppercase letter, one special character, and be at least 6 characters long")
    private String newPassword;

    private String confirmPassword;
}
