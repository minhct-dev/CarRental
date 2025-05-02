package com.pjb2.rental_car.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
public class CarOwnerBoookingPageReponse extends PageResponseAbstract implements Serializable {
    public List<CarOwnerBookingResponse> bookings;
}
