package com.pjb2.rental_car.service;

import com.pjb2.rental_car.dto.response.DriverDashboardResponse;
import com.pjb2.rental_car.dto.response.SearchDriverResponse;
import com.pjb2.rental_car.exception.ApiException;

import java.time.ZoneId;
import java.util.Date;
import java.util.List;

public interface DriverService {
    //MinhCT6
    List<SearchDriverResponse> searchDriver (Date startDate, Date endDate, String provinceCode, String districtCode, String wardCode) throws ApiException;
    DriverDashboardResponse getDriverDashboard(String token, Date startWeekDate, Date endWeekDate, Date startMonthDate, Date endMonthdate) throws ApiException;
}
