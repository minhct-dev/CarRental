package com.pjb2.rental_car.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
public class FeedbackReportPageResponse extends PageResponseAbstract implements Serializable {
    private Double averageRating;
    private int numberOfRatings;
    private int numberOf1starRatings;
    private int numberOf2starRatings;
    private int numberOf3starRatings;
    private int numberOf4starRatings;
    private int numberOf5starRatings;
    private List<FeedbackReportResponse> listCarFeedback;
}
