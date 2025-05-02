package com.pjb2.rental_car.dto.response;

import com.pjb2.rental_car.entity.Car;
import com.pjb2.rental_car.entity.CarBrand;
import com.pjb2.rental_car.entity.UserImages;
import lombok.*;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CarOwnerDetailResponse {
    private int id;
    private String name;
    private String phone;
    private String email;
    private String address;
    private String description;
    private String imageUrl;
    private Map<String, Object> carList;
    private List<CarBrandResponse> carBrandList;
    private Map<String, Object> carFeedbackList;
    private String joinedAt;
    private int totalBooking;
    private double averageRating;
    private int carPage;
    private int feebackPage;
    private int totalFeedback;


}
