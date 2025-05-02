package com.pjb2.rental_car.service;

import org.springframework.stereotype.Service;

public interface EmailService {
    public void sendEmail(String to, String subject, String body);
}
