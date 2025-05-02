package com.pjb2.rental_car.controller;

import com.pjb2.rental_car.dto.response.HomePageInformationResponse;
import com.pjb2.rental_car.dto.response.ResponseSuccess;
import com.pjb2.rental_car.exception.ApiException;
import com.pjb2.rental_car.service.HomepageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/homepage")
@RequiredArgsConstructor
@Tag(name = "Homepage Controller")
public class HomeController {
    private final HomepageService homepageService;

    @GetMapping("/homepage-information")
    public ResponseSuccess<HomePageInformationResponse> getHomePageInformation(@RequestHeader(name = "Authorization",required = false) String token) throws ApiException {
        try {
            return new ResponseSuccess<>(HttpStatus.OK.value(), "Get home page information success",homepageService.getHomePageInformation(token));
        }catch (Exception e){
            if(e instanceof ApiException){
                throw e;
            }else throw new RuntimeException(e.getMessage());
        }
        }
}
