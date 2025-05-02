package com.pjb2.rental_car.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class WalletResponse {
    private double balance;
    private List<Map<String, Object>> history;
    private int totalPages;
    private int currentPage;
    private LocalDate fromDate;
    private LocalDate toDate;
}
