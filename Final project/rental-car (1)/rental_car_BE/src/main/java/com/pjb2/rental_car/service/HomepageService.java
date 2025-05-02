package com.pjb2.rental_car.service;

import com.pjb2.rental_car.dto.response.HomePageInformationResponse;
import com.pjb2.rental_car.exception.ApiException;

public interface HomepageService {
    HomePageInformationResponse getHomePageInformation(String token) throws ApiException;
}
