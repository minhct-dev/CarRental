package com.pjb2.rental_car.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class AdminDashboardResponse {
    private List<PieChartResponse> userPieChart;
    //-------------------------------------------------------
    private int sumOfUser;
    private Double balanceInWallet;
    //-------------------------------------------------------
    private int numberOfBookingInWeek;
    private int numberOfBookingInMonth;
    //-------------------------------------------------------
    private List<ChartResponse> barChartIncomeByMonth;
    //-------------------------------------------------------
    private List<DashboardBookingDTO> listOfBookings;

}
