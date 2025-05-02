package com.pjb2.rental_car.exception;
import com.pjb2.rental_car.dto.response.ResponseErr;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.sql.SQLIntegrityConstraintViolationException;

@RestControllerAdvice
public class HandleException {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ResponseErr> handleApiException(ApiException e) {
        System.out.println(e.getMessage());
        ResponseErr err = new ResponseErr(e.getStatus(), e.getMessage());
        return ResponseEntity.badRequest().body(err);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity exception(MethodArgumentNotValidException e) {
        String message = e.getMessage();
        int start = message.lastIndexOf("[");
        int end = message.lastIndexOf("]");
        message = message.substring(start +1, end-1);
        return ResponseEntity.status(e.getStatusCode()).body(new ResponseErr(e.getStatusCode().value(), message));
    }

    @ExceptionHandler(SQLIntegrityConstraintViolationException.class)
    public ResponseEntity exception(SQLIntegrityConstraintViolationException e) {
        String message = e.getMessage();
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ResponseErr(HttpStatus.CONFLICT.value(), message));
    }

    @ExceptionHandler(value = {BadCredentialsException.class, UsernameNotFoundException.class})
    public ResponseEntity<ResponseErr> handleException(Exception e) {
        ResponseErr responseError = new ResponseErr();
        responseError.setMessage("Incorrect email or password");
        responseError.setStatus(HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseError);
    }

    @ExceptionHandler(value = NoResourceFoundException.class)
    public ResponseEntity<ResponseErr> handleException(NoResourceFoundException e) {
        ResponseErr responseError = new ResponseErr();
        responseError.setMessage(e.getMessage());
        responseError.setStatus(HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(responseError);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ResponseErr> handleRuntimeException(RuntimeException e) {
        return ResponseEntity.status(500)
                .body(new ResponseErr(500, e.getMessage()));
    }

}