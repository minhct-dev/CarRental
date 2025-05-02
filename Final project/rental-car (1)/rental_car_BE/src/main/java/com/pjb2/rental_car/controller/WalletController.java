package com.pjb2.rental_car.controller;

import com.pjb2.rental_car.dto.request.WalletTransactionDTO;
import com.pjb2.rental_car.dto.response.ResponseSuccess;
import com.pjb2.rental_car.dto.response.WalletResponse;
import com.pjb2.rental_car.exception.ApiException;
import com.pjb2.rental_car.service.WalletService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@RequiredArgsConstructor
@RequestMapping("/wallet")
@RestController
public class WalletController {
    @Autowired
    private WalletService walletService;

    @PreAuthorize("hasAuthority('user')")
    @Operation(summary = "View wallet details", description = "View wallet balance and paginated history within a date range")
    @GetMapping("/view")
    public ResponseSuccess<WalletResponse> getWalletDetails(
            @RequestHeader("Authorization") String token,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) throws ApiException {
        try {
            if (from == null) {
                from = LocalDate.now().minusDays(7);
            }
            if (to == null) {
                to = LocalDate.now();
            }
            if (page<=0) page = 1;

            WalletResponse walletDetails = walletService.getWalletDetails(token, from, to, page , size);

            return new ResponseSuccess<>(200, "Success", new WalletResponse(
                    walletDetails.getBalance(),
                    walletDetails.getHistory(),
                    walletDetails.getTotalPages(),
                    walletDetails.getCurrentPage() ,
                    walletDetails.getFromDate(),
                    walletDetails.getToDate()
            ));
        }catch (Exception e){
            if(e instanceof ApiException){
                throw e;
            }else throw new RuntimeException(e.getMessage());
        }

    }
    @PreAuthorize("hasAuthority('user')")
    @Operation(summary = "Top-up wallet", description = "Add money to the wallet")
    @PostMapping("/topup")
    public ResponseSuccess<String> topUpWallet(
            @RequestBody WalletTransactionDTO request,
            @RequestHeader("Authorization") String token
    ) throws ApiException {
        try {
            walletService.topUp(token, request.getAmount(), request.getNote());
            return new ResponseSuccess<>(200, "Success", "Wallet topped up successfully");
        }catch (Exception e){
            if(e instanceof ApiException){
                throw e;
            }else throw new RuntimeException(e.getMessage());
        }

    }
    @PreAuthorize("hasAuthority('user')")
    @Operation(summary = "Withdraw from wallet", description = "Withdraw money from the wallet")
    @PostMapping("/withdraw")
    public ResponseSuccess<String> withdrawFromWallet(
            @RequestBody WalletTransactionDTO request,
            @RequestHeader("Authorization") String token
    ) throws ApiException {
        try {
            walletService.withdraw(token, request.getAmount(), request.getNote());
            return new ResponseSuccess<>(200, "Success", "Withdrawal successful");
        }catch (Exception e){
            if(e instanceof ApiException){
                throw e;
            }else throw new RuntimeException(e.getMessage());
        }

    }
}
