package com.pjb2.rental_car.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;
@Getter
@Setter
public class CarRequestPageResponse extends PageResponseAbstract implements Serializable {
    private int noOfPendingRequests;
    private int noOfAcceptedRequests;
    private int noOfRejectedRequests;
    private List<CarRequestResponse> listCarRequestResponses;

}
