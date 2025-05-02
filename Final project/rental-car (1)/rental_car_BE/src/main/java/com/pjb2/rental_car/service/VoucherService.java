package com.pjb2.rental_car.service;

import com.pjb2.rental_car.dto.response.*;
import com.pjb2.rental_car.exception.ApiException;

import java.util.List;

public interface VoucherService {
    void deleteVoucher(String token , int voucherId) throws ApiException;
    VoucherDetailResponse voucherDetails(int voucherId) throws ApiException;
    void activateVoucher(String token , int voucherId) throws ApiException;
    void deactivateVoucher(String token , int voucherId) throws ApiException;
    List<ListAdminVoucherResponse> listAdminVouchers();
    List<ListCarOwnerVoucherResponse> listCarOwnerVouchers(String token);
    List<CarVoucherResponse> listVouchersByCar(int carId) throws ApiException;
    List<CarListBoxDTO> listCarListBox(String token) throws ApiException;
    CarVoucherSearchResponse searchVoucher(int carId,String voucherCode) throws ApiException;
}
