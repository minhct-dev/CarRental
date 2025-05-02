package com.pjb2.rental_car.service;

import com.pjb2.rental_car.dto.response.WalletResponse;
import com.pjb2.rental_car.entity.Wallet;
import com.pjb2.rental_car.exception.ApiException;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface WalletService {
    Wallet getWalletByToken(String token) throws ApiException;
    double getWalletBalance(String token) throws ApiException;
    Page<Map<String, Object>> getWalletHistory(String token, LocalDate from, LocalDate to, int page, int size) throws ApiException;

    WalletResponse getWalletDetails(String token) throws ApiException;
    WalletResponse getWalletDetails(String token, LocalDate from, LocalDate to, int page, int size) throws ApiException;

    void topUp(String token, double amount, String note) throws ApiException;
    void withdraw(String token, double amount, String note) throws ApiException;
}

