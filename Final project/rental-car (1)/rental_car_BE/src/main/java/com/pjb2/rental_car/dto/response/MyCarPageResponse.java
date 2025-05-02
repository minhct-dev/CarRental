package com.pjb2.rental_car.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;
@Getter
@Setter

public class MyCarPageResponse extends PageResponseAbstract implements Serializable {
    public List<MyCarResponse> myListCar;
}
