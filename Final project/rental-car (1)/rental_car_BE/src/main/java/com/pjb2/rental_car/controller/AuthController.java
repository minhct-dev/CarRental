package com.pjb2.rental_car.controller;

import com.pjb2.rental_car.dto.request.AuthRequestDTO;
import com.pjb2.rental_car.dto.request.RegisterUserDTO;
import com.pjb2.rental_car.dto.request.ResetUserDTO;
import com.pjb2.rental_car.dto.response.ResponseSuccess;
import com.pjb2.rental_car.dto.response.TokenResponseDTO;
import com.pjb2.rental_car.dto.response.WardResponseDTO;
import com.pjb2.rental_car.entity.Ward;
import com.pjb2.rental_car.exception.ApiException;
import com.pjb2.rental_car.service.AuthService;
import com.pjb2.rental_car.util.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
   private final AuthService authService;
   @Operation(summary = "login function",description = "login tra ve 2 cai token")
    @PostMapping("/login")
    public ResponseSuccess<TokenResponseDTO> login(@RequestBody AuthRequestDTO user) throws ApiException{
       try {
           return new ResponseSuccess<>(HttpStatus.OK.value(),
                   "Login successfully",
                   authService.login(user.getEmail(),user.getPassword()));
       } catch (Exception e) {
           if (e instanceof ApiException) {
               throw (ApiException) e;
           } else {
               throw new RuntimeException(e.getMessage());
           }
       }
    }
    @Operation(summary = "register function", description = "đăng kí trả về status message")
    @PostMapping("/register")
    public ResponseSuccess<String> register(@RequestBody RegisterUserDTO user) throws ApiException {
        try {
            System.out.println("Received register request: " + user);
            return new ResponseSuccess<>(HttpStatus.OK.value(),
                    "success",
                    authService.register(user));
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }
    @GetMapping("/activate")
    public ResponseSuccess<String> isActive(@RequestParam String token) throws ApiException {
        try {
            String isValid = authService.activate(token);
            return new ResponseSuccess<>(HttpStatus.OK.value(),"active processing",isValid);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @PostMapping("/refresh-token")
    public ResponseSuccess<String> refresh(@RequestParam String Rtoken) throws ApiException {
        try {
            String newAT = authService.refresh(Rtoken);
            return new ResponseSuccess<>(HttpStatus.OK.value(),"Refresh Successfully", newAT);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }
    @GetMapping("/forgot")
    public ResponseSuccess<String> forgot(@RequestParam String email) throws ApiException {

        try {
            String mailProcess = authService.mailForget(email);
            return new ResponseSuccess<>(HttpStatus.OK.value(), "mail forget processing",mailProcess);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }
    @PostMapping("/reset")
    public ResponseSuccess<String> reset(@RequestBody ResetUserDTO user) throws ApiException {
        try {
            authService.resetPass(user.getToken(), user.getNewPassword());
            return new ResponseSuccess<>(HttpStatus.OK.value(), "---reset processing---","new pass = " + user.getNewPassword());
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }
    @PostMapping("/re-active")
    public ResponseSuccess<String> reactive(@RequestParam String email) throws ApiException {
        try {
            return new ResponseSuccess<>(HttpStatus.OK.value(),"---Active processing---",authService.reActive(email));
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }
    @GetMapping("/logout")
    public ResponseSuccess<String> logout(@RequestHeader("Authorization") String token) throws ApiException {
        try {
            return new ResponseSuccess<>(HttpStatus.OK.value(), "logout processing",authService.logout(token));
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }
    @GetMapping("/checkToken")
    public ResponseSuccess<String> checkToken(@RequestParam String token) throws ApiException {
        try {
            return new ResponseSuccess<>(200, "Valid token", authService.checkForgetToken(token));
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }
}
