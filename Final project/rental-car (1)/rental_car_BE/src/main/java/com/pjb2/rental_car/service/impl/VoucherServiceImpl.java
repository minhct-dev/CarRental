package com.pjb2.rental_car.service.impl;

import com.pjb2.rental_car.dto.response.*;
import com.pjb2.rental_car.entity.*;
import com.pjb2.rental_car.exception.ApiException;
import com.pjb2.rental_car.repository.CarRepository;
import com.pjb2.rental_car.repository.SystemImageRepository;
import com.pjb2.rental_car.repository.UserRepository;
import com.pjb2.rental_car.repository.VoucherRepository;
import com.pjb2.rental_car.service.VoucherService;
import com.pjb2.rental_car.util.JwtService;
import com.pjb2.rental_car.util.common.VoucherStatus;
import com.pjb2.rental_car.util.common.VoucherType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class VoucherServiceImpl implements VoucherService {
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final VoucherRepository voucherRepository;
    private final CarOwnerServiceImpl carOwnerServiceImpl;
    private final CarServiceImpl carServiceImpl;
    private final SystemImageRepository systemImageRepository;
    private final CarRepository carRepository;

    @Override
    public void deleteVoucher(String token, int voucherId) throws ApiException {
        String email = jwtService.getEmailFromToken(token);
        User user = userRepository.findByEmail(email);
        Voucher voucher = carOwnerServiceImpl.findVoucherById(voucherId);
        if(voucher.getType() == VoucherType.CAR_OWNER_VOUCHER && voucher.getUser() != user) {
            throw new ApiException(HttpStatus.UNAUTHORIZED.value(), "You are not allowed to delete this voucher");
        }
        voucher.setDeleted(true);
        voucherRepository.save(voucher);
    }

    @Override
    public VoucherDetailResponse voucherDetails(int voucherId) throws ApiException{
        Voucher voucher = carOwnerServiceImpl.findVoucherById(voucherId);
        return VoucherDetailResponse.builder()
                .name(voucher.getName())
                .description(voucher.getDescription())
                .scope(voucher.getScope().toString())
                .startDate(voucher.getStartDate() != null ? voucher.getStartDate().toString() : "")
                .endDate(voucher.getEndDate() != null ? voucher.getEndDate().toString() : "")
                .quantity(voucher.getQuantity() != null ? voucher.getQuantity() : null)
                .percentRate(voucher.getPercentRate())
                .maxPrice(voucher.getMaxPrice())
                .fixedPrice(voucher.getFixedPrice())
                .code(voucher.getCode() != null ? voucher.getCode() : "")
                .status(voucher.getStatus().toString())
                .imageUrl(!voucher.getSystemImages().isEmpty() ? voucher.getSystemImages().get(0).getImageUrl() : "")
                .listCarId(Optional.ofNullable(voucher.getCars())
                        .orElse(Collections.emptyList())
                        .stream().map(Car::getId).toList())
                .brandId(Optional.ofNullable(voucher.getBrand()).map(CarBrand::getId).orElse(0))
                .listModelId(Optional.ofNullable(voucher.getModels())
                        .orElse(Collections.emptyList())
                        .stream().map(CarModel::getId).toList())
                .build();
    }

    @Override
    public void activateVoucher(String token, int voucherId) throws ApiException {
        String email = jwtService.getEmailFromToken(token);
        User user = userRepository.findByEmail(email);
        Voucher voucher = carOwnerServiceImpl.findVoucherById(voucherId);
        if(voucher.getType() == VoucherType.CAR_OWNER_VOUCHER && voucher.getUser() != user) {
            throw new ApiException(HttpStatus.UNAUTHORIZED.value(), "You are not allowed to delete this voucher");
        }
        voucher.setStatus(VoucherStatus.ACTIVE);
        voucherRepository.save(voucher);
    }

    @Override
    public void deactivateVoucher(String token, int voucherId)throws ApiException {
        String email = jwtService.getEmailFromToken(token);
        User user = userRepository.findByEmail(email);
        Voucher voucher = carOwnerServiceImpl.findVoucherById(voucherId);
        if(voucher.getType() == VoucherType.CAR_OWNER_VOUCHER && voucher.getUser() != user) {
            throw new ApiException(HttpStatus.UNAUTHORIZED.value(), "You are not allowed to delete this voucher");
        }
        voucher.setStatus(VoucherStatus.INACTIVE);
        voucherRepository.save(voucher);
    }

    @Override
    public List<ListAdminVoucherResponse> listAdminVouchers() {
        List<Voucher> adminVoucher = voucherRepository.findAdminVouchers();
        List<ListAdminVoucherResponse> adminVoucherResponses = adminVoucher.stream().map(voucher -> ListAdminVoucherResponse.builder()
                .voucherId(voucher.getId())
                .name(voucher.getName())
                .imageUrl(systemImageRepository.findByVoucherId(voucher.getId())!= null ? systemImageRepository.findByVoucherId(voucher.getId()).getImageUrl() : "")
                .status(voucher.getStatus().toString())
                .code(voucher.getCode())
                .startDate(voucher.getStartDate())
                .endDate(voucher.getEndDate())
                .quantity(voucher.getQuantity())
                .percentRate(voucher.getPercentRate())
                .maxPrice(voucher.getMaxPrice())
                .fixedPrice(voucher.getFixedPrice())
                .type(voucher.getType().toString())
                .isHomepageDisplay(voucher.isHomepageDisplay())
                .build()).toList();
        return adminVoucherResponses;
    }

    @Override
    public List<ListCarOwnerVoucherResponse> listCarOwnerVouchers(String token) {
        String email = jwtService.getEmailFromToken(token);
        User user = userRepository.findByEmail(email);
        List<Voucher> vouchers = voucherRepository.findCarOwnerVouchers(user.getId());
        List<ListCarOwnerVoucherResponse> listCarOwnerVoucherResponses = vouchers.stream().map(voucher -> ListCarOwnerVoucherResponse.builder()
                .voucherId(voucher.getId())
                .name(voucher.getName())
                .status(voucher.getStatus().toString())
                .code(voucher.getCode())
                .startDate(voucher.getStartDate())
                .endDate(voucher.getEndDate())
                .quantity(voucher.getQuantity())
                .percentRate(voucher.getPercentRate())
                .maxPrice(voucher.getMaxPrice())
                .fixedPrice(voucher.getFixedPrice())
                .type(voucher.getType().toString())
                .build()).toList();
        return listCarOwnerVoucherResponses;
    }

    @Override
    public List<CarVoucherResponse> listVouchersByCar(int carId) throws ApiException {
        Car car = carServiceImpl.findCarById(carId);
        List<Voucher> adminVoucher = voucherRepository.getListCarAdminVoucher(car.getCarModel().getBrand().getId(),car.getCarModel().getId());
        List<Voucher> carOwnerVoucher = voucherRepository.getListCarOwnerVoucher(car.getId(),car.getUser().getId());
        List<Voucher> listAllVoucher = new ArrayList<>();
        listAllVoucher.addAll(adminVoucher);
        listAllVoucher.addAll(carOwnerVoucher);
        List<CarVoucherResponse> carVoucherResponses = listAllVoucher.stream().map(voucher -> {
            try {
                return CarVoucherResponse.builder()
                        .voucherId(voucher.getId())
                        .name(voucher.getName())
                        .maxPrice(voucher.getMaxPrice())
                        .percentRate(voucher.getPercentRate())
                        .code(voucher.getCode())
                        .fixedPrice(voucher.getFixedPrice())
                        .remainDays(voucher.getEndDate() != null
                                ? Math.max((int) ((voucher.getEndDate().getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)), 0)
                                : -1)
                        .code(voucher.getCode())
                        .description(voucher.getDescription())
                        .usable(isVoucherUsable(voucher.getId(),carId))
                        .build();
            } catch (ApiException e) {
                throw new RuntimeException(e);
            }
        }).sorted(Comparator.comparing(CarVoucherResponse::isUsable).reversed()).toList();
        return carVoucherResponses;
    }

    @Override
    public List<CarListBoxDTO> listCarListBox(String token) throws ApiException {
        String email = jwtService.getEmailFromToken(token);
        User user = userRepository.findByEmail(email);
        List<Car> cars = carRepository.getCarByUserId(user.getId());
        List<CarListBoxDTO> carListBoxDTOs = cars.stream().map(car -> CarListBoxDTO.builder()
                .carId(car.getId())
                .licensePlate(car.getLicencePlate())
                .carName(car.getName())
                .build()).toList();
        return carListBoxDTOs;
    }

    @Override
    public CarVoucherSearchResponse searchVoucher(int carId,String voucherCode) throws ApiException {
        Car car = carServiceImpl.findCarById(carId); 
        Voucher searchedVoucher = voucherRepository.searchVoucherByCodeAndCarId(carId,voucherCode,car.getCarModel().getBrand().getId(),car.getCarModel().getId());
        if(searchedVoucher == null) {throw new ApiException(HttpStatus.NO_CONTENT.value(), "Voucher not found");}
        CarVoucherSearchResponse.CarVoucherSearchResponseBuilder searchResponse = CarVoucherSearchResponse.builder();
        if(searchedVoucher.getType()==VoucherType.ADMIN_VOUCHER){
            searchResponse.carBrand(CarBrandDTO.builder()
                            .id(searchedVoucher.getBrand().getId())
                            .name(searchedVoucher.getBrand().getName())
                            .build())
                    .listModels(searchedVoucher.getModels().stream().map(carModel -> CarModelDTO.builder()
                            .id(carModel.getId())
                            .name(carModel.getName())
                            .build()).toList());
        }

        return searchResponse
                .voucherId(searchedVoucher.getId())
                .name(searchedVoucher.getName())
                .maxPrice(searchedVoucher.getMaxPrice())
                .percentRate(searchedVoucher.getPercentRate())
                .fixedPrice(searchedVoucher.getFixedPrice())
                .code(searchedVoucher.getCode())
                .usable(isVoucherUsable(searchedVoucher.getId(),carId))
                .remainDays(searchedVoucher.getEndDate() != null
                        ? Math.max((int) ((searchedVoucher.getEndDate().getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)), 0)
                        : -1)
                .code(searchedVoucher.getCode())
                .description(searchedVoucher.getDescription())
                .build();
    }

    //method to check if voucher is usable or not
    public boolean isVoucherUsable(int voucherId,int carId) throws ApiException {
        Car car = carServiceImpl.findCarById(carId);
        Voucher voucher = voucherRepository.findById(voucherId).orElseThrow(()->new ApiException(HttpStatus.NO_CONTENT.value(), "Voucher not found"));
        return (voucher.getBrand() == null || voucher.getBrand().equals(car.getCarModel().getBrand()))
                && (voucher.getModels().isEmpty() || voucher.getModels().contains(car.getCarModel()))
                && (voucher.getQuantity() == -1 || voucher.getQuantity() > 0)
                && (voucher.getEndDate() == null || voucher.getEndDate().after(new Date()));
    }
}
