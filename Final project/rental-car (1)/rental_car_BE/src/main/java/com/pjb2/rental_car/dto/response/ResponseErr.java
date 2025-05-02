package com.pjb2.rental_car.dto.response;

import lombok.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;



@AllArgsConstructor
@NoArgsConstructor
@Data
public class ResponseErr  {
    private int status;
    private String message;
}
