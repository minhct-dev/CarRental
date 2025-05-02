package com.pjb2.rental_car.service.impl;

import com.pjb2.rental_car.dto.response.*;
import com.pjb2.rental_car.entity.Booking;
import com.pjb2.rental_car.entity.User;
import com.pjb2.rental_car.entity.WalletHistory;
import com.pjb2.rental_car.exception.ApiException;
import com.pjb2.rental_car.repository.*;
import com.pjb2.rental_car.service.DriverService;
import com.pjb2.rental_car.util.JwtService;
import com.pjb2.rental_car.util.common.WalletHistoryType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static java.util.Comparator.comparing;

@Service
@RequiredArgsConstructor
public class DriverServiceImpl implements DriverService {
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final UserServiceImpl userServiceImpl;
    private final UserImagesRepository userImagesRepository;
    private final JwtService jwtService;
    private final CarOwnerServiceImpl carOwnerServiceImpl;
    private final WalletHistoryRepository walletHistoryRepository;
    private final DriverBookingRepository driverBookingRepository;

    @Override
    public List<SearchDriverResponse> searchDriver(Date startDate, Date endDate, String provinceCode, String districtCode, String wardCode) throws ApiException {
        List<User> listDriver = userRepository.searchByAddressCode(provinceCode,districtCode,wardCode);
        List<SearchDriverResponse> drivers = new ArrayList<>();
        for (User user : listDriver) {
            String avatarUrl=userImagesRepository.findAvatarByUserId(user.getId()) == null? "" :userImagesRepository.findAvatarByUserId(user.getId()).getImageUrl();
            drivers.add(new SearchDriverResponse(user.getId(),
                    driverBookingRepository.checkNearestDriverBooking(user.getId(),startDate,endDate)!=null? "Booked":"Available",
                    user.getName(),
                    user.getDriverExp(),
                    user.getPrice(),
                    user.getLateFee(),
                    user.getDob(),
                    user.getPhone(),
                    user.getEmail(),
                    user.getNationalId(),
                    userServiceImpl.getImagesUrl(userImagesRepository.findDrivingLicenseByUserId(user.getId())),
                    new ProvinceResponseDTO(user.getProvince().getCode(),user.getProvince().getName()),
                    new DistrictResponseDTO(user.getDistrict().getCode(),user.getDistrict().getName()),
                    new WardResponseDTO(user.getWard().getCode(),user.getWard().getName()),
                    user.getAddressDetail(),
                    bookingRepository.findBookingByDriverId(user.getId()).size(),
                    avatarUrl
                    ));
        }
        return drivers;
    }

    @Override
    public DriverDashboardResponse getDriverDashboard(String token, Date startWeekDate, Date endWeekDate, Date startMonthDate, Date endMonthdate) throws ApiException {
        String email = jwtService.getEmailFromToken(token);
        User driver = userRepository.findByEmail(email);

        List<Booking> listBookingOfDriver = bookingRepository.findBookingByDriverId(driver.getId());
        int numberOfBookingInWeek = listBookingOfDriver.stream()
                .filter(booking ->  !booking.getStartDate().before(startWeekDate)&& !booking.getStartDate().after(endWeekDate))
                .toList()
                .size();
        int numberOfBookingInMonth = listBookingOfDriver.stream()
                .filter(booking ->  !booking.getStartDate().before(startMonthDate)&& !booking.getStartDate().after(endMonthdate))
                .toList()
                .size();
        List<Double> listWeeklyBalance = walletHistoryRepository.findWalletHistoryByTypeAndDateRange(driver.getWallet().getId(),WalletHistoryType.RENTED,startWeekDate,endWeekDate).stream().map(WalletHistory::getAmount).toList();
        List<Double> listLastWeeklyBalance = walletHistoryRepository.findWalletHistoryOfLastWeek(driver.getWallet().getId(),WalletHistoryType.RENTED,startWeekDate,endWeekDate).stream().map(WalletHistory::getAmount).toList();
        double thisWeekIncome = listWeeklyBalance.stream().mapToDouble(d->d).sum();
        double lastWeekIncome = listLastWeeklyBalance.stream().mapToDouble(d->d).sum();
        IncomeDTO incomeInWeek = IncomeDTO.builder()
                .balance(thisWeekIncome)
                .changePercentage(carOwnerServiceImpl.incomePercentageChanges(lastWeekIncome, thisWeekIncome))
                .build();

        List<Double> listMonthlyBalance = walletHistoryRepository.findWalletHistoryByTypeAndDateRange(driver.getWallet().getId(),WalletHistoryType.RENTED,startMonthDate,endMonthdate).stream().map(WalletHistory::getAmount).toList();
        List<Double> listLastMonthlyBalance = walletHistoryRepository.findWalletHistoryOfLastMonth(driver.getWallet().getId(),WalletHistoryType.RENTED,startMonthDate,endMonthdate).stream().map(WalletHistory::getAmount).toList();
        double thisMonthIncome = listMonthlyBalance.stream().mapToDouble(d->d).sum();
        double lastMonthIncome = listLastMonthlyBalance.stream().mapToDouble(d->d).sum();
        IncomeDTO incomeInMonth = IncomeDTO.builder()
                .balance(thisMonthIncome)
                .changePercentage(carOwnerServiceImpl.incomePercentageChanges(lastMonthIncome, thisMonthIncome))
                .build();

        List<WalletHistory> userWalletHistory = driver.getWallet().getHistory();
        List<DashboardBookingDTO> listBookings = userWalletHistory.stream()
                .filter(history -> history.getType().equals(WalletHistoryType.RENTED))
                .sorted(comparing((WalletHistory h) -> h.getBooking().getEndDate()).reversed())
                .limit(6)
                .map(history -> DashboardBookingDTO.builder()
                        .bookingId(history.getBooking().getId())
                        .carName(history.getBooking().getCar().getName())
                        .licensePlate(history.getBooking().getCar().getLicencePlate())
                        .startDate(history.getBooking().getStartDate())
                        .endDate(history.getBooking().getEndDate())
                        .profit(history.getAmount())
                        .build()).toList();

        List<ChartResponse> barChartRespons = walletHistoryRepository.findByDataForIncomeBarCharByMonth(driver.getWallet().getId());


        return DriverDashboardResponse.builder()
                .numberOfBookingInWeek(numberOfBookingInWeek)
                .numberOfBookingInMonth(numberOfBookingInMonth)
                .incomeInWeek(incomeInWeek)
                .incomeInMonth(incomeInMonth)
                .listOfBookings(listBookings)
                .barChartIncomeByMonth(barChartRespons)
                .build();
    }
}
