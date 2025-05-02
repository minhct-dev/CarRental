package com.pjb2.rental_car.controller;

import com.pjb2.rental_car.dto.response.*;
import com.pjb2.rental_car.exception.ApiException;
import com.pjb2.rental_car.repository.VoucherRepository;
import com.pjb2.rental_car.service.AdminService;
import com.pjb2.rental_car.service.VoucherService;
import com.pjb2.rental_car.service.impl.VoucherServiceImpl;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/voucher")
@Tag(name = "Voucher Controller")
@RequiredArgsConstructor
public class VoucherController {
    private final VoucherService voucherService;
    private final AdminService adminService;

    @PreAuthorize("hasAnyAuthority('carOwner', 'admin')")
    @DeleteMapping("/delete-voucher")
    public ResponseSuccess deleteVoucher(@RequestHeader(name = "Authorization") String token, @RequestParam int voucherId) throws ApiException {
        try{
            voucherService.deleteVoucher(token, voucherId);
            return new ResponseSuccess(HttpStatus.OK.value(), "delete voucher successfully",null);
        }catch (Exception e){
            if(e instanceof ApiException){
                throw e;
            }else throw new RuntimeException(e.getMessage());
        }

    }

    @PreAuthorize("hasAnyAuthority('carOwner', 'admin')")
    @GetMapping("/voucher-details")
    public ResponseSuccess<VoucherDetailResponse> getVoucherDetail(@RequestParam int voucherId) throws ApiException {
        try {
            return new ResponseSuccess(HttpStatus.OK.value(), "get voucher detail successfully",voucherService.voucherDetails(voucherId));
        }catch (Exception e){
            if(e instanceof ApiException){
                throw e;
            }else throw new RuntimeException(e.getMessage());
        }

    }

    @PreAuthorize("hasAnyAuthority('carOwner', 'admin')")
    @PutMapping("/activate-voucher")
    public ResponseSuccess activateVoucher(@RequestHeader(name = "Authorization") String token, @RequestParam int voucherId) throws ApiException {
        try {
            voucherService.activateVoucher(token, voucherId);
            return new ResponseSuccess(HttpStatus.OK.value(), "activate voucher successfully",null);
        }catch (Exception e){
            if(e instanceof ApiException){
                throw e;
            }else throw new RuntimeException(e.getMessage());
        }


    }

    @PreAuthorize("hasAnyAuthority('carOwner', 'admin')")
    @PutMapping("/deactivate-voucher")
    public ResponseSuccess deactivateVoucher(@RequestHeader(name = "Authorization") String token, @RequestParam int voucherId) throws ApiException {
        try {
            voucherService.deactivateVoucher(token, voucherId);
            return new ResponseSuccess(HttpStatus.OK.value(), "deactivate voucher successfully",null);
        }catch (Exception e){
            if(e instanceof ApiException){
                throw e;
            }else throw new RuntimeException(e.getMessage());
        }


    }

    @PreAuthorize("hasAuthority('admin')")
    @GetMapping("/list-admin-voucher")
    public ResponseSuccess<List<ListAdminVoucherResponse>> listAdminVoucher() throws ApiException {
        try {
            return new ResponseSuccess<>(HttpStatus.OK.value(), "list admin voucher successfully",voucherService.listAdminVouchers());
        }catch (Exception e){
            if(e instanceof ApiException){
                throw e;
            }else throw new RuntimeException(e.getMessage());
        }

    }

    @PreAuthorize("hasAuthority('carOwner')")
    @GetMapping("/list-car-owner-voucher")
    public ResponseSuccess<List<ListCarOwnerVoucherResponse>> listCarOwnerVoucher(@RequestHeader(name = "Authorization") String token) throws ApiException {
        try {
            return new ResponseSuccess<>(HttpStatus.OK.value(), "list car owner voucher successfully",voucherService.listCarOwnerVouchers(token));
        }catch (Exception e){
            if(e instanceof ApiException){
                throw e;
            }else throw new RuntimeException(e.getMessage());
        }
    }

    @GetMapping("/list-car-voucher")
    public ResponseSuccess<List<CarVoucherResponse>> listCarVoucher(@RequestParam int carId) throws ApiException {
        try {
            return new ResponseSuccess<>(HttpStatus.OK.value(), "list car voucher successfully",voucherService.listVouchersByCar(carId));
        }catch (Exception e){
            if(e instanceof ApiException){
                throw e;
            }else throw new RuntimeException(e.getMessage());
        }

    }

    @GetMapping("/list-car-drop-box")
    public ResponseSuccess<List<CarListBoxDTO>> listCarDropBox(@RequestHeader(name = "Authorization") String token) throws ApiException {
        try {
            return new ResponseSuccess<>(HttpStatus.OK.value(), "",voucherService.listCarListBox(token));
        }catch (Exception e){
            if(e instanceof ApiException){
                throw e;
            }else throw new RuntimeException(e.getMessage());
        }
    }

    @GetMapping("/search-voucher")
    public ResponseSuccess<CarVoucherSearchResponse> searchVoucher(@RequestParam int carId,@RequestParam String code) throws ApiException {
        try {
            return new ResponseSuccess<>(HttpStatus.OK.value(), "search voucher successfully",voucherService.searchVoucher(carId,code));
        }catch (Exception e){
            if(e instanceof ApiException){
                throw e;
            }else throw new RuntimeException(e.getMessage());
        }

    }





}
