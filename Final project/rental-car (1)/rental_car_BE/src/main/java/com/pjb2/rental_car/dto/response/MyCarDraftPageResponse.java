package com.pjb2.rental_car.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
public class MyCarDraftPageResponse extends PageResponseAbstract implements Serializable {
    public List<MyCarDraftResponse> listCarDraftResponse;
}
