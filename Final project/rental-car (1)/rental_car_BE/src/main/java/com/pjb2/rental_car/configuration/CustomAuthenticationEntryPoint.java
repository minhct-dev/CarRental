package com.pjb2.rental_car.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.pjb2.rental_car.dto.response.ResponseErr;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationEntryPoint;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException, ServletException {

        response.setContentType("application/json");
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        ResponseErr error = new ResponseErr();
        error.setStatus(HttpStatus.UNAUTHORIZED.value());
        String message = authException.getMessage().toLowerCase();
        if (message.contains("expired")) {
            error.setMessage("Token has expired");
        } else if (message.contains("missing") || message.contains("not found") || message.contains("no bearer token")) {
            error.setMessage("Missing token");
        } else {
            error.setMessage("Invalid token");
        }
        objectMapper.writeValue(response.getWriter(), error);
    }
}

