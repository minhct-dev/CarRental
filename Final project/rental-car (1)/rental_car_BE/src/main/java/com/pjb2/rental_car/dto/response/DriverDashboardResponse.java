package com.pjb2.rental_car.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class DriverDashboardResponse {
    private int numberOfBookingInWeek;
    private int numberOfBookingInMonth;
    //-------------------------------------------------------
    private IncomeDTO incomeInWeek;
    private IncomeDTO incomeInMonth;
    //-------------------------------------------------------
    private List<ChartResponse> barChartIncomeByMonth;
    //-------------------------------------------------------
    private List<DashboardBookingDTO> listOfBookings;
}
