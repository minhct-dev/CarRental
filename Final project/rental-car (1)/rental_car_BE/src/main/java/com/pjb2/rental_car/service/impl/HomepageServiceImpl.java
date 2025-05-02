package com.pjb2.rental_car.service.impl;

import com.pjb2.rental_car.dto.request.ChatMessagePayloadDTO;
import com.pjb2.rental_car.dto.response.HomePageInformationResponse;
import com.pjb2.rental_car.dto.response.VoucherHomepageResponse;
import com.pjb2.rental_car.entity.ChatMessage;
import com.pjb2.rental_car.entity.User;
import com.pjb2.rental_car.entity.Voucher;
import com.pjb2.rental_car.exception.ApiException;
import com.pjb2.rental_car.repository.*;
import com.pjb2.rental_car.service.HomepageService;
import com.pjb2.rental_car.service.VoucherService;
import com.pjb2.rental_car.util.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class HomepageServiceImpl implements HomepageService {
    private final VoucherRepository voucherRepository;
    private final SystemImageRepository systemImageRepository;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final MessageAttachmentRepository messageAttachmentRepository;

    @Override
    public HomePageInformationResponse getHomePageInformation(String token) throws ApiException {
        //voucher information
        List<Voucher> listHomepageVouchers = voucherRepository.findAllHomepageDisplayedVouchers();
        List<VoucherHomepageResponse> listHomepageVoucherResponses = listHomepageVouchers.stream().map(voucher -> VoucherHomepageResponse.builder()
                .voucherId(voucher.getId())
                .voucherImageUrl(systemImageRepository.findByVoucherId(voucher.getId())!= null ? systemImageRepository.findByVoucherId(voucher.getId()).getImageUrl() : "")
                .name(voucher.getName())
                .description(voucher.getDescription())
                .startDate(voucher.getStartDate())
                .endDate(voucher.getEndDate())
                .fixedPrice(voucher.getFixedPrice())
                .percentRate(voucher.getPercentRate())
                .maxPrice(voucher.getMaxPrice())
                .build()).toList();
        HomePageInformationResponse response = new HomePageInformationResponse();
        response.setListVoucherHomepage(listHomepageVoucherResponses);
        return response;
    }
}
