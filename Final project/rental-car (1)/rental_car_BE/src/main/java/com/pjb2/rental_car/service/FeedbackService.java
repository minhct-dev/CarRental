package com.pjb2.rental_car.service;

import com.pjb2.rental_car.dto.request.BookingFeedbackRequestDTO;
import com.pjb2.rental_car.dto.request.CarFeedbackRequestDTO;
import com.pjb2.rental_car.dto.response.ReportPageResponse;
import com.pjb2.rental_car.exception.ApiException;

public interface FeedbackService {
    void addCarFeedback(CarFeedbackRequestDTO feedbackRequest, String token) throws ApiException;
    void addBookingFeedback(BookingFeedbackRequestDTO feedbackRequest, String token) throws ApiException;

    ReportPageResponse getFeedbackReport(String token, String sort, int page, int size,Integer carId) throws ApiException;
}
