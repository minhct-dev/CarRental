package com.pjb2.rental_car.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pjb2.rental_car.dto.response.ResponseErr;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

import java.io.IOException;

@NoArgsConstructor
public class CustomTokenAccessDeniedHandler implements AccessDeniedHandler {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        response.setContentType("application/json");
        response.setStatus(HttpStatus.FORBIDDEN.value());
        ResponseErr error  = new ResponseErr();
        error.setStatus(HttpStatus.FORBIDDEN.value());
        error.setMessage("Access Denied");
        objectMapper.writeValue(response.getWriter(), error);
    }
}
