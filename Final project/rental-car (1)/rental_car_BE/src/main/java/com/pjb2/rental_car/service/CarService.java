package com.pjb2.rental_car.service;

import com.pjb2.rental_car.dto.request.*;
import com.pjb2.rental_car.dto.response.*;
import com.pjb2.rental_car.entity.CarFunctionInfo;
import com.pjb2.rental_car.entity.CarType;
import com.pjb2.rental_car.exception.ApiException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;

public interface CarService {
    CarDetailResponse getCarDetail(int id, String token, Date start_date, Date end_date,int feedbackPage) throws ApiException;
    MyCarPageResponse getListCar(String token, String sort, int Page, int Size);
    CarStep1Respone addCarStep1(String token,Integer draftId, String type , List<MultipartFile> registration,List<MultipartFile> certificate,List<MultipartFile> insurance, CarStep1Request req) throws ApiException, IOException;
    CarStep2Response addCarStep2(int draftId,String type ,List<MultipartFile> lists, CarStep2Request req) throws ApiException, IOException;
    CarStep4Response addCarStep3(int draftId,String type ,CarStep3Request req) throws ApiException;
    CarStep4Response addCarStep4(int draftId) throws ApiException;
    void addCarSubmitButton(int draftId) throws ApiException;
    CarDraftResponse getCarDraftProcess(String token) throws ApiException;
    Page<CarSearchResultResponse> searchAvailableCars(CarSearchRequestDTO request, Pageable pageable) throws ApiException;
    List<CarBrandResponse> getAllBrands();
    List<CarModelResponse> getModelsByBrand(Integer brandId);
    List<String> getAllColors();
    Double getMaxPrice();
    List<CarType> getAllCarType();
    List<CarFunctionInfo> getCarFunction();
    CarInformationResponse getEditCarScreenInformation(int carId) throws ApiException;
    void deleteCarDraft(int draftId) throws ApiException;
    void deleteCar(String token,int carId) throws ApiException;
    void deleteCarDraftOutOfDatabase(String token,int draftId) throws ApiException;
}
