package com.pjb2.rental_car.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pjb2.rental_car.dto.request.CarSearchRequestDTO;
import com.pjb2.rental_car.dto.request.CarStep1Request;
import com.pjb2.rental_car.dto.request.CarStep2Request;
import com.pjb2.rental_car.dto.request.CarStep3Request;
import com.pjb2.rental_car.dto.response.CarDetailResponse;
import com.pjb2.rental_car.dto.response.MyCarPageResponse;
import com.pjb2.rental_car.dto.response.MyCarResponse;
import com.pjb2.rental_car.dto.response.ResponseSuccess;
import com.pjb2.rental_car.dto.response.*;
import com.pjb2.rental_car.entity.CarFunction;
import com.pjb2.rental_car.entity.CarFunctionInfo;
import com.pjb2.rental_car.entity.CarType;
import com.pjb2.rental_car.exception.ApiException;
import com.pjb2.rental_car.service.AdminService;
import com.pjb2.rental_car.service.CarService;
import com.pjb2.rental_car.service.impl.CarServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
// 1 api lay all brand (id,name),
// 1 api lay model theo brand id(id name),
// 1 api lay color (name)(ko trung),
// 1 api lay max price


@RestController
@RequestMapping("/car")
@Tag(name = "Car Controller")
@RequiredArgsConstructor
public class CarController {
    @Autowired
    private CarService carService;
    @Autowired
    private CarServiceImpl carServiceImpl;
    private final AdminService adminService;

    @GetMapping("/car_detail")
    public ResponseSuccess<CarDetailResponse>  getCarDetail(@RequestParam int id, @RequestHeader(name = "Authorization",required = false) String token,
                                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date start_date,
                                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date end_date,
                                                            @RequestParam @DefaultValue(value = "1") int feedbackPage)throws ApiException {

        try {
            CarDetailResponse data = carService.getCarDetail(id,token,start_date,end_date,feedbackPage);
            return new ResponseSuccess<>(HttpStatus.OK.value(), "response car detail successfully", data);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }
    //ANHCP2
    @Operation(summary = "Search available cars", description = "Search for available cars based on filters")
    @PostMapping("/search")
    public ResponseSuccess<Map<String, Object>> searchAvailableCars(
            @Valid @RequestBody CarSearchRequestDTO request) throws ApiException {

        try {

            int size = request.getPageSize() > 0 ? request.getPageSize() : 10;

            Pageable pageable = PageRequest.of(0, size);


            Page<CarSearchResultResponse> carResults = carServiceImpl.searchAvailableCars(request, pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("filter", request);
            response.put("totalPages", carResults.getTotalPages());
            response.put("currentPage", carResults.getNumber() + 1);
            response.put("pageSize", carResults.getSize());
            response.put("cars", carResults.getContent());

            return new ResponseSuccess<>(200, "success", response);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    //ANHCP2
    @GetMapping("/brands")
    public ResponseSuccess<List<CarBrandResponse>> getAllBrands() {
        try {
            List<CarBrandResponse> brands = carService.getAllBrands();
            return new ResponseSuccess<>(200, "Success", brands);
        } catch (Exception e) {
                throw new RuntimeException(e.getMessage());
        }
    }

    @GetMapping("/models/{brandId}")
    public ResponseSuccess<List<CarModelResponse>> getModelsByBrand(@PathVariable Integer brandId) {
        try {
            List<CarModelResponse> models = carService.getModelsByBrand(brandId);
            return new ResponseSuccess<>(200, "Success", models);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @GetMapping("/colors")
    public ResponseSuccess<List<String>> getAllColors() {
        try {
            List<String> colors = carService.getAllColors();
            return new ResponseSuccess<>(200, "Success", colors);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @GetMapping("/max-price")
    public ResponseSuccess<Double> getMaxPrice() {
        try {
            Double maxPrice = carService.getMaxPrice();
            return new ResponseSuccess<>(200, "Success", maxPrice);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }
    @GetMapping("/car-type")
    public ResponseSuccess<List<CarType>> getCarType() {
        try {
            return new ResponseSuccess<>(200,"Success",carService.getAllCarType());
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }
    @GetMapping("/car-function")
    public ResponseSuccess<List<CarFunctionInfo>> getCarFunction() {
        try {
            return new ResponseSuccess<>(200,"Success",carService.getCarFunction());
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }
    @GetMapping("/get-car-request-detail")
    public ResponseSuccess<CarDraftResponse> getCarRequestDetail(@RequestParam int draftId) throws ApiException {
        try {
            return new ResponseSuccess<>(HttpStatus.OK.value(),"get detail success",adminService.getCarRequestDetail(draftId));
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }



}
