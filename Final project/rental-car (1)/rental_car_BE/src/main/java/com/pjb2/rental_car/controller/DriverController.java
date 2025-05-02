package com.pjb2.rental_car.controller;

import com.pjb2.rental_car.dto.response.DriverDashboardResponse;
import com.pjb2.rental_car.dto.response.ResponseSuccess;
import com.pjb2.rental_car.dto.response.SearchDriverResponse;
import com.pjb2.rental_car.exception.ApiException;
import com.pjb2.rental_car.service.DriverService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/driver")
public class DriverController {
    private final DriverService driverService;
    @PreAuthorize("hasAuthority('user')")
    @GetMapping("/search")
    public ResponseSuccess<List<SearchDriverResponse>> searchDriver(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date startDate, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)Date endDate,
                                                                    @RequestParam(required = false) String provinceCode, @RequestParam(required = false) String districtCode,
                                                                    @RequestParam(required = false) String wardCode) throws ApiException {
        try{
            List<SearchDriverResponse> list = driverService.searchDriver(startDate, endDate, provinceCode, districtCode, wardCode);
            return new ResponseSuccess<>(HttpStatus.OK.value(), "Search driver confirmed successfully", list);
        }catch (Exception e){
            if(e instanceof ApiException){
                throw e;
            }else throw new RuntimeException(e.getMessage());
        }
    }

    @GetMapping("/dashboard")
    public ResponseSuccess<DriverDashboardResponse> getDriverDashboard(@RequestHeader(name = "Authorization") String token,@RequestParam String  startWeekDate,@RequestParam String endWeekDate,
                                                                       @RequestParam String startMonthDate,@RequestParam String endMonthDate) throws ApiException, ParseException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Date startWeekDateParsed = dateFormat.parse(startWeekDate);
            Date endWeekDateParsed = dateFormat.parse(endWeekDate);
            Date startMonthDateParsed = dateFormat.parse(startMonthDate);
            Date endMonthDateParsed = dateFormat.parse(endMonthDate);
            return new ResponseSuccess<>(HttpStatus.OK.value(), "get dashboard successfully", driverService.getDriverDashboard(token,startWeekDateParsed,endWeekDateParsed,startMonthDateParsed,endMonthDateParsed));
        } catch (Exception e) {
            if(e instanceof ApiException){
                throw e;
            }else if(e instanceof ParseException){
                throw new RuntimeException(e.getMessage());
            }else throw new RuntimeException(e.getMessage());
        }
    }
}
