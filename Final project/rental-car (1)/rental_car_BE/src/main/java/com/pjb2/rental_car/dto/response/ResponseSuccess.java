package com.pjb2.rental_car.dto.response;

import lombok.*;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ResponseSuccess<T>  {
    private int status;
    private String message;
    private T data;
}
