package com.pjb2.rental_car.dto.response;

import com.pjb2.rental_car.entity.*;
import com.pjb2.rental_car.util.common.CarStatus;
import com.pjb2.rental_car.util.common.FuelType;
import com.pjb2.rental_car.util.common.TransmissionType;
import lombok.*;
import org.apache.xmlbeans.impl.xpath.saxon.SaxonXQuery;

import java.awt.print.Book;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CarDetailResponse implements Serializable {
    private int carId;
    private List<String> carImages;
    private List<String> registrationImages;
    private List<String> certificateImages;
    private List<String> insuranceImages;
    private String name;
    private String brand;
    private int noOfRide;
    private String province;
    private String district;
    private String ward;
    private String addressDetail;
    private String status;
    private String licencePlate;
    private String color;
    private String model;
    private int productionYear;
    private int noOfSeats;
    private TransmissionType transmissionType;
    private FuelType fuelType;
    private double mileage;
    private double fuelConsumption;
    private String description;
    private List<CarFunctionInfo> carFunctionsInfo;
    private List<String> carTermOfUses;
    private double basePrice;
    private double deposit;
    private double rating;
    private int noOfRatings;
    private boolean book_checked;
    private String car_type;
    private String book_start_date;
    private String book_end_date;
    private Double late_fee;

    //car owner detail
    private int carOwnerId;
    private String carOwnerName;
    private String carOwnerAvatarUrl;
    private double carOwnerAverageRating;
    private String carOwnerProvince;
    private String carOwnerDistrict;


    //list feedback
    private List<CarFeedbackResponse> listCarFeedbackResponses;
    private int totalFeedbackPage;


}
