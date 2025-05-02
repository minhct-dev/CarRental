package com.pjb2.rental_car.dto.request;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterUserDTO {
    @NotBlank(message = "Username cannot be blank")
    private String username;
    @NotBlank(message = "Password cannot be blank")
    private String password;
    @NotBlank(message = "Confirm password cannot blank")
    private String confirmPassword;
    @NotBlank(message = "Email cannot be blank")
    @Pattern(regexp ="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", message = "Email is invalid format")
    private String email;
    @NotBlank(message = "Phone cannot be blank")
    @Pattern(regexp = "^0\\d{9}$", message = "Phone is invalid format")
    private String phone;
    @NotBlank(message = "Role must be filled")
    private int roleSignUpId;
    @AssertTrue
    private boolean checkTerm;


}
