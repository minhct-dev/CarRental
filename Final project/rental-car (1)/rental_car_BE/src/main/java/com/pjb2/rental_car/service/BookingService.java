package com.pjb2.rental_car.service;

import com.pjb2.rental_car.dto.request.BookingRequestDTO;
import com.pjb2.rental_car.dto.request.EditBookingRequestDTO;
import com.pjb2.rental_car.dto.response.*;
import com.pjb2.rental_car.exception.ApiException;
import com.pjb2.rental_car.util.common.CarOwnerStatus;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;

public interface BookingService {
    BookingPageResponse bookingPage(String token, String sort, int Page, int Size) throws ApiException;

    CarOwnerBoookingPageReponse carBookingPage(String token, String sort, int page, int size) throws ApiException;

    BookingResponse editBooking(int bookingId, String token, EditBookingRequestDTO booking, MultipartFile licenseFront, MultipartFile licenseBack) throws ApiException, IOException;

    BookingResponse rentACar(String token, BookingRequestDTO bookingRequest, int paymentChoice,String voucherCode) throws ApiException;

    //AnhCP2
    public void confirmDepositByCarOwner(int bookingId) throws ApiException;

    public void confirmPayment(int bookingId) throws ApiException;

    void confirmPickup(int bookingId) throws ApiException;

    void confirmBookingByDriver(int bookingId) throws ApiException;

    //QuanHT11
    BookingInfoResponse getBookingInfo(String token, int bookingId) throws ApiException;

    String cancelBoookingForCustomer(String token, int bookingId) throws ApiException;

    String rejectByCarOwner(String token, int bookingId) throws ApiException;

    String rejectByDriver(String token, int bookingId) throws ApiException;

    String handleCancelBookingByCarOwner(String token, int bookingId, int choice) throws  ApiException;

    BookingBillResponse returnCar(String token, int bookingId, Date actualTime) throws ApiException;

    String paidPayment(String token, int bookingId) throws ApiException;

    BookingBillResponse returnBill(String token, int bookingId) throws ApiException;

    List<DriverListReponse> SearchDriverByCategory(String token, String provinceCode, String districtCode, String wardCode) throws ApiException;

    List<DriverBookingResponse> viewDriverBooking(String token) throws ApiException;

    CarOwnerStatus checkCarOwnerStatus(int bookingId) throws ApiException;

    String changeStatusRentCar(int carId) throws ApiException;
}



