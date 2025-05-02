package com.pjb2.rental_car.service;

import com.pjb2.rental_car.dto.request.RegisterUserDTO;
import com.pjb2.rental_car.dto.response.TokenResponseDTO;
import com.pjb2.rental_car.exception.ApiException;

public interface AuthService {
    TokenResponseDTO login(String email, String password) throws ApiException;
    String logout(String token ) throws ApiException;
    String register(RegisterUserDTO registerUserDTO) throws ApiException;
    String activate(String token) throws ApiException;
    String refresh(String token) throws ApiException;
    String mailForget(String email) throws ApiException;
    void resetPass(String token, String newPass) throws ApiException;
    String reActive(String email);
    String checkForgetToken(String token) throws ApiException;
}
