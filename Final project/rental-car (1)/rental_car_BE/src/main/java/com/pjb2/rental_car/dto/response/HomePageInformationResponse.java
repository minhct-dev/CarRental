package com.pjb2.rental_car.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class HomePageInformationResponse {
    List<VoucherHomepageResponse> listVoucherHomepage;
}
