package com.pjb2.rental_car.controller;

import com.pjb2.rental_car.dto.response.*;
import com.pjb2.rental_car.entity.District;
import com.pjb2.rental_car.entity.Province;
import com.pjb2.rental_car.entity.Ward;
import com.pjb2.rental_car.exception.ApiException;
import com.pjb2.rental_car.repository.DistrictRepository;
import com.pjb2.rental_car.repository.ProvinceRepository;
import com.pjb2.rental_car.repository.WardRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.autoconfigure.observation.ObservationProperties;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/address")
@Tag(name = "Address Controller")
public class AddressController {
    @Autowired
    public ProvinceRepository provinceRepository;
    @Autowired
    public DistrictRepository districtRepository;
    @Autowired
    public WardRepository wardRepository;

    @GetMapping("/province")
    public ResponseSuccess<List<ProvinceResponseDTO>> getAllProvince() throws ApiException {
        try {
            List<Province> provinceList = provinceRepository.findAll();
            List<ProvinceResponseDTO> provinceNameList = provinceList.stream().map(province -> new ProvinceResponseDTO(province.getCode(), province.getName())).toList();
            return new ResponseSuccess<>(HttpStatus.OK.value(), "province list", provinceNameList);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @GetMapping("/district")
    public ResponseSuccess<List<DistrictResponseDTO>> getDistrictByProvince(@RequestParam int code) throws ApiException {
        try {
            List<District> districtList = districtRepository.findDistrictByProvince(code);
            List<DistrictResponseDTO> districtNameList = districtList.stream().map(district -> new DistrictResponseDTO(district.getCode(),district.getName())).toList();
            return new ResponseSuccess<>(HttpStatus.OK.value(), "district by province list", districtNameList);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @GetMapping("/ward")
    public ResponseSuccess<List<WardResponseDTO>> getWardByDistrict(@RequestParam int code) throws ApiException {
        try {
            List<Ward> wardList = wardRepository.findWardByDistrict(code);
            List<WardResponseDTO> wardNameList = wardList.stream().map(ward -> new WardResponseDTO(ward.getCode(), ward.getName())).toList();
            return new ResponseSuccess<>(HttpStatus.OK.value(), "ward by district list", wardNameList);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

}
