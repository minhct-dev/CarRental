package com.pjb2.rental_car.service.impl;

import com.pjb2.rental_car.dto.request.BookingFeedbackRequestDTO;
import com.pjb2.rental_car.dto.request.CarFeedbackRequestDTO;
import com.pjb2.rental_car.dto.response.ReportPageResponse;
import com.pjb2.rental_car.dto.response.ReportResponse;
import com.pjb2.rental_car.entity.Booking;
import com.pjb2.rental_car.entity.Car;
import com.pjb2.rental_car.entity.Feedback;
import com.pjb2.rental_car.entity.User;
import com.pjb2.rental_car.exception.ApiException;
import com.pjb2.rental_car.repository.BookingRepository;
import com.pjb2.rental_car.repository.CarRepository;
import com.pjb2.rental_car.repository.FeedbackRepository;
import com.pjb2.rental_car.repository.UserRepository;
import com.pjb2.rental_car.service.FeedbackService;
import com.pjb2.rental_car.util.JwtService;
import com.pjb2.rental_car.util.common.BookingStatus;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {
    private final FeedbackRepository feedbackRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final CarServiceImpl carServiceImpl;
    private final BookingRepository bookingRepository;
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    @Override
    @Transactional
    public void addCarFeedback(CarFeedbackRequestDTO feedbackRequest, String token) throws ApiException {
        User user = getUserByToken(token);
        Car car = carRepository.findById(feedbackRequest.getCarId())
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST.value(), "Car not found"));

        Feedback feedback = Feedback.builder()
                .rating(feedbackRequest.getRating())
                .comment(feedbackRequest.getComment())
                .user(user)
                .car(car)
                .build();

        feedbackRepository.save(feedback);
    }

    @Override
    @Transactional
    public void addBookingFeedback(BookingFeedbackRequestDTO feedbackRequest, String token) throws ApiException {
        User user = getUserByToken(token);

        Booking booking = bookingRepository.findById(feedbackRequest.getBookingId())
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST.value(), "Booking not found"));

        if (!booking.getStatus().equals(BookingStatus.COMPLETED)) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "You can only give feedback for completed bookings");
        }

        Car car = booking.getCar();
        Feedback feedback = Feedback.builder()
                .rating(feedbackRequest.getRating())
                .comment(feedbackRequest.getComment())
                .user(user)
                .car(car)
                .booking(booking)
                .build();

        feedbackRepository.save(feedback);
    }




    @Override
    public ReportPageResponse getFeedbackReport(String token, String sort, int page, int size,Integer carId) throws ApiException {
        //Sorting
        Sort.Order order = new Sort.Order(Sort.Direction.ASC, "updated_at");
        if(StringUtils.hasLength(sort)) {
            Pattern pattern = Pattern.compile("(\\w+?)(:)(.*)");
            Matcher matcher = pattern.matcher(sort);
            if(matcher.find()) {
                String columnName = matcher.group(1);
                if(matcher.group(3).equals("asc")) {
                    order = new Sort.Order(Sort.Direction.ASC, columnName);
                }else if(matcher.group(3).equals("desc"))
                {
                    order = new Sort.Order(Sort.Direction.DESC, columnName);
                }else if(matcher.group(3).equals("group")){

                }

            }
        }
        int pageNo = 0;
        if (page > 0) {
            pageNo = page - 1;
        }
        //Paging
        Pageable pageable = PageRequest.of(pageNo, size,Sort.by(order));
        if(carId == null) carId = 0;


        return getListReportResponse(token,pageable,carId);
    }

    private User getUserByToken(String token) throws ApiException {
        String email = jwtService.getEmailFromToken(token);
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ApiException(HttpStatus.NOT_FOUND.value(), "User not found");
        }
        return user;
    }

    //get list report for each carOwner
    public ReportPageResponse getListReportResponse(String token, Pageable pageable, int carId) {
        String email = jwtService.getEmailFromToken(token);
        User user = userRepository.findByEmail(email);
        Page<Feedback> reportPage = feedbackRepository.getAllFeedbackByUserId(user.getId(),pageable);
        Double averageRating = carServiceImpl.getAverageRating(reportPage.getContent());
        List<ReportResponse> listReportResponse = reportPage.getContent().stream().map(feedback->ReportResponse.builder()
                .userName(feedback.getUser().getName())
                .rating(feedback.getRating())
                .date(feedback.getCreatedAt().format(formatter))
                .comment(feedback.getComment())
                .carName(feedback.getCar().getName())
                .carId(feedback.getCar().getId())
                .build()).toList();
        if(carId>0){
            listReportResponse=listReportResponse.stream()
                    .filter(report -> carId == report.getCarId()) // Chỉ lấy những report có carId
                    .toList();
        }
        ReportPageResponse response = new ReportPageResponse();
        response.setPageNumber(reportPage.getNumber()+1);
        response.setPageSize(pageable.getPageSize());
        response.setTotalElements(reportPage.getNumberOfElements());
        response.setTotalPages(reportPage.getTotalPages());
        response.setReportResponseList(listReportResponse);
        response.setAverageReportRating(averageRating);
        return response;
    }

}
