package com.pjb2.rental_car.controller;

import com.pjb2.rental_car.dto.request.BookingFeedbackRequestDTO;
import com.pjb2.rental_car.dto.request.CarFeedbackRequestDTO;
import com.pjb2.rental_car.dto.response.ResponseSuccess;
import com.pjb2.rental_car.exception.ApiException;
import com.pjb2.rental_car.service.FeedbackService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/feedback")
@RequiredArgsConstructor
public class FeedbackController {
    private final FeedbackService feedbackService;

    @PreAuthorize("hasAuthority('user')")
    @Operation(summary = "Give car feedback", description = "Give rating and comment after renting a car.")
    @PostMapping("/give")
    public ResponseEntity<ResponseSuccess<Void>> giveFeedback(@RequestBody CarFeedbackRequestDTO feedbackRequest,
                                                              @RequestHeader("Authorization") String token) throws ApiException {
        try{
            feedbackService.addCarFeedback(feedbackRequest, token);
            return ResponseEntity.ok(new ResponseSuccess<>(200, "success", null));
        }catch (Exception e){
            if(e instanceof ApiException){
                throw e;
            }else throw new RuntimeException(e.getMessage());
        }

    }

    @PreAuthorize("hasAuthority('user')")
    @Operation(summary = "Give booking feedback", description = "Give rating and comment after completing a booking.")
    @PostMapping("/give-booking")
    public ResponseEntity<ResponseSuccess<Void>> giveBookingFeedback(@Valid @RequestBody BookingFeedbackRequestDTO feedbackRequest,
                                                                     @RequestHeader("Authorization") String token) throws ApiException {
        try {
            feedbackService.addBookingFeedback(feedbackRequest, token);
            return ResponseEntity.ok(new ResponseSuccess<>(200, "success", null));
        }catch (Exception e){
            if(e instanceof ApiException){
                throw e;
            }else throw new RuntimeException(e.getMessage());
        }
    }
}
