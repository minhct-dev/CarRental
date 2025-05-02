package com.pjb2.rental_car.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSearchRequestDTO {
    private String name;
    private String email;
    private String role;
    private String status;
    private int page = 1;
    private int size = 10;
}
