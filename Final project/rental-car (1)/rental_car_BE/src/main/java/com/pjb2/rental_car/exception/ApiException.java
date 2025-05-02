package com.pjb2.rental_car.exception;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
public class ApiException extends Exception {
    private int status;
    private String message;

    public ApiException(int status, String message) {
        super(message);
        this.message = message;
        this.status = status;

    }
}