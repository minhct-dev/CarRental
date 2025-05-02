package com.pjb2.rental_car.dto.response;

import lombok.*;

import java.io.Serializable;
import java.util.List;
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ReportPageResponse extends PageResponseAbstract implements Serializable {
    private List<ReportResponse> reportResponseList;
    private double averageReportRating;
}
