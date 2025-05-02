package com.pjb2.rental_car.service;

import com.pjb2.rental_car.dto.request.CarDraftEditRequest;
import com.pjb2.rental_car.dto.request.CarOwnerVoucherEditRequest;
import com.pjb2.rental_car.dto.request.CarOwnerVoucherRequest;
import com.pjb2.rental_car.dto.request.CarStep1Request;
import com.pjb2.rental_car.dto.response.*;
import com.pjb2.rental_car.exception.ApiException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

public interface CarOwnerService {
    CarOwnerDetailResponse getCarOwnerDetail(int carOwnerId,int carPage, int feedbackPage) throws ApiException;
    FeedbackReportPageResponse getListFeedbackReport(String token, String sort, int Page, int Size,int starRating) throws ApiException;
    void editCarDraft(String token,int draftId, List<MultipartFile> registration, List<MultipartFile> certificate, List<MultipartFile> insurance, List<MultipartFile> lists,CarDraftEditRequest req) throws ApiException;
    MyCarDraftPageResponse getListCarDraft(String token, String sort, int page, int size) throws ApiException;
    void editCarInformation(String token ,int carId, List<MultipartFile> files,List<MultipartFile> registration,List<MultipartFile> certificate,List<MultipartFile> insurance ,CarDraftEditRequest request) throws ApiException, IOException;
    void deleteUpdateCarDraft(String token,int draftId) throws ApiException;
    //voucher management----
    void createVoucherByCarOwner(String token, CarOwnerVoucherRequest request) throws ApiException;
    void editVoucherByCarOwner(String token, int voucherId, CarOwnerVoucherEditRequest request) throws ApiException;
    //admin page
    CarOwnerDashboardResponse getCarOwnerDashboard(String token, Date startWeekDate, Date endWeekDate, Date startMonthDate, Date endMonthdate) throws ApiException;
}
