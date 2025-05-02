package com.pjb2.rental_car.service.impl;

import com.pjb2.rental_car.dto.request.BookingRequestDTO;
import com.pjb2.rental_car.dto.request.EditBookingRequestDTO;
import com.pjb2.rental_car.dto.response.*;
import com.pjb2.rental_car.entity.*;
import com.pjb2.rental_car.exception.ApiException;
import com.pjb2.rental_car.repository.*;
import com.pjb2.rental_car.service.BookingService;
import com.pjb2.rental_car.service.CarService;
import com.pjb2.rental_car.service.EmailService;
import com.pjb2.rental_car.util.JwtService;
import com.pjb2.rental_car.util.Util;
import com.pjb2.rental_car.util.common.*;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
    private final BookingRepository bookingRepository;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final CarRepository carRepository;
    private final WalletRepository walletRepository;
    private final CarImagesRepository carImagesRepository;
    private final WalletHistoryRepository walletHistoryRepository;
    private final ProvinceRepository provinceRepository;
    private final DistrictRepository districtRepository;
    private final EmailService emailService;
    private final WardRepository wardRepository;
    private final UserImagesRepository userImagesRepository;
    private final CarTermOfUseRepository carTermOfUseRepository;
    private final WalletDepositRepository walletDepositRepository;
    private final CancelBookingReposiroty cancelBookingReposiroty;
    private final CarService carService;
    private final CarServiceImpl carServiceImpl;
    private final CarOwnerServiceImpl carOwnerServiceImpl;
    private final Util util;
    private final DriverBookingRepository driverBookingRepository;
    private final FeedbackRepository feedbackRepository;
    private final VoucherRepository voucherRepository;

    //hàm chuyển đổi date sang localdatetime
    private LocalDateTime convertToLocalDate(Date date) {
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
    }

    public BookingPageResponse viewBookingList(String token, Pageable pageable) throws ApiException {
        boolean isValid = jwtService.validateToken(token);
        if (!isValid) {
            throw new ApiException(401, "Invalid Token");
        }
        String email = jwtService.getEmailFromToken(token);
        int userId = userRepository.findByEmail(email).getId();
        List<viewBookingCustomerResponse> ls = new ArrayList<>();
        Page<Booking> bookings = bookingRepository.findBookingsByUserId(userId, pageable);
        for (Booking booking : bookings) {
            List<CarImages> imgLs = booking.getCar().getCarImages();
            List<String> allOfImgCar = new ArrayList<>();
            for (CarImages img : imgLs) {
                if (img.getType().equals(CarImageType.CAR_IMAGE)) {
                    allOfImgCar.add(img.getImageUrl());
                }
            }
            boolean isFeedBack = feedbackRepository.isFeedback(booking.getId());

            CancelBooking currentCancelBooking = booking.getCancelBooking();
            if (imgLs.isEmpty()) throw new ApiException(400, "Car image list is empty");
            ls.add(new viewBookingCustomerResponse
                    (
                            booking.getId(),
                            booking.getCar().getName(),
                            convertToLocalDate(booking.getStartDate()),
                            convertToLocalDate(booking.getEndDate()),
                            booking.getBasePrice(),
                            booking.getDeposit(),
                            booking.getStatus(),
                            booking.getCar().getId(),
                            allOfImgCar,
                            (booking.getDriverStatus() != null) ? booking.getDriverStatus() : null,
                            booking.getCarOwnerStatus(),
                            (currentCancelBooking != null) ? currentCancelBooking.getChoice() : 0,
                            (currentCancelBooking != null) ? currentCancelBooking.getStatus() : null,
                            (isFeedBack) ? "RECEIVED" : "NONE",
                            booking.getDiscount()
                    )
            );
        }
        BookingPageResponse bookingPageResponse = new BookingPageResponse();
        bookingPageResponse.setBookings(ls);
        bookingPageResponse.setPageNumber(bookings.getNumber() + 1);
        bookingPageResponse.setPageSize(pageable.getPageSize());
        bookingPageResponse.setTotalElements(bookings.getNumberOfElements());
        bookingPageResponse.setTotalPages(bookings.getTotalPages());
        return bookingPageResponse;
    }

    @Override
    public BookingPageResponse bookingPage(String token, String sort, int Page, int Size) throws ApiException {
        //Sorting
        Sort.Order order = new Sort.Order(Sort.Direction.ASC, "updated_at");
        if (StringUtils.hasLength(sort)) {
            Pattern pattern = Pattern.compile("(\\w+?)(:)(.*)");
            Matcher matcher = pattern.matcher(sort);
            if (matcher.find()) {
                String columnName = matcher.group(1);
                if (matcher.group(3).equals("asc")) {
                    order = new Sort.Order(Sort.Direction.ASC, columnName);
                } else {
                    order = new Sort.Order(Sort.Direction.DESC, columnName);
                }

            }
        }
        int pageNo = 0;
        if (Page > 0) {
            pageNo = Page - 1;
        }
        //Paging
        Pageable pageable = PageRequest.of(pageNo, Size, Sort.by(order));
        //----
        return viewBookingList(token, pageable);
    }

    public CarOwnerBoookingPageReponse viewBookingListCarOwner(String token, Pageable pageable) throws ApiException {
        boolean isValid = jwtService.validateToken(token);
        if (!isValid) {
            throw new ApiException(401, "Invalid Token");
        }
        String email = jwtService.getEmailFromToken(token);
        int userId = userRepository.findByEmail(email).getId();
        List<CarOwnerBookingResponse> ls = new ArrayList<>();
        Page<Booking> bookings = bookingRepository.findBookingsByCarOnwer(userId, pageable);
        for (Booking booking : bookings) {
            List<CarImages> imgLs = booking.getCar().getCarImages();
            List<String> allOfImgCar = new ArrayList<>();
            for (CarImages img : imgLs) {
                if (img.getType().equals(CarImageType.CAR_IMAGE)) {
                    allOfImgCar.add(img.getImageUrl());
                }
            }
            WalletDeposit currentWalletDeposit = booking.getWalletDeposit();
            CancelBooking currentCancelBooking = booking.getCancelBooking();
            if (imgLs.isEmpty()) throw new ApiException(400, "Car image list is empty");
            ls.add(new CarOwnerBookingResponse(
                    //tra them thong tin wallet deposit
                    // tra them thong tin cancel booking(phai la o trang thai pending)
                    booking.getId(),
                    booking.getCar().getName(),
                    convertToLocalDate(booking.getStartDate()),
                    convertToLocalDate(booking.getEndDate()),
                    booking.getBasePrice(),
                    booking.getDeposit(),
                    booking.getStatus(),
                    booking.getCar().getId(),
                    booking.getCar().getUser().getName(),
                    booking.getCar().getUser().getEmail(),
                    allOfImgCar,
                    currentWalletDeposit.getDepositAmount(),
                    currentWalletDeposit.getStatus(),
                    (currentCancelBooking != null) ? currentCancelBooking.getChoice() : 0,
                    (currentCancelBooking != null) ? currentCancelBooking.getStatus() : null,
                    (booking.getDriverStatus() != null) ? booking.getDriverStatus() : null,
                    booking.getCarOwnerStatus(),
                    booking.getDiscount()
            ));
        }
        CarOwnerBoookingPageReponse carOwnerBookingPageResponse = new CarOwnerBoookingPageReponse();
        carOwnerBookingPageResponse.setBookings(ls);
        carOwnerBookingPageResponse.setPageNumber(bookings.getNumber() + 1);
        carOwnerBookingPageResponse.setPageSize(pageable.getPageSize());
        carOwnerBookingPageResponse.setTotalElements(bookings.getNumberOfElements());
        carOwnerBookingPageResponse.setTotalPages(bookings.getTotalPages());
        return carOwnerBookingPageResponse;

    }

    @Override
    public CarOwnerBoookingPageReponse carBookingPage(String token, String sort, int Page, int Size) throws ApiException {
        //Sorting
        Sort.Order order = new Sort.Order(Sort.Direction.ASC, "updated_at");
        if (StringUtils.hasLength(sort)) {
            Pattern pattern = Pattern.compile("(\\w+?)(:)(.*)");
            Matcher matcher = pattern.matcher(sort);
            if (matcher.find()) {
                String columnName = matcher.group(1);
                if (matcher.group(3).equals("asc")) {
                    order = new Sort.Order(Sort.Direction.ASC, columnName);
                } else {
                    order = new Sort.Order(Sort.Direction.DESC, columnName);
                }

            }
        }
        int pageNo = 0;
        if (Page > 0) {
            pageNo = Page - 1;
        }
        Pageable pageable = PageRequest.of(pageNo, Size, Sort.by(order));
        return viewBookingListCarOwner(token, pageable);
    }
    @Transactional(rollbackFor = ApiException.class)
    @Override
    public BookingResponse editBooking(int bookingId, String token, EditBookingRequestDTO booking, MultipartFile licenseFront, MultipartFile licenseBack) throws ApiException, IOException {
        Booking selectedBooking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ApiException(400, "Booking cannot found"));

        if (selectedBooking == null) {
            throw new ApiException(400, "Cannot found booking");
        }

        if (selectedBooking.getStatus().equals(BookingStatus.IN_PROGRESS)
                || selectedBooking.getStatus().equals(BookingStatus.PENDING_PAYMENT)
                || selectedBooking.getStatus().equals(BookingStatus.COMPLETED)
                || selectedBooking.getStatus().equals(BookingStatus.CANCELLED)
        ) {
            throw new ApiException(400, "You cannot permission because you are already in progress");
        }
        if (!Pattern.matches("\\d{10}", booking.getPhone())) {
            throw new ApiException(400, "Phone number is invalid. Please try again");
        }
        Province bookingProvince = (Province) provinceRepository.findByCode(booking.getProvinceCode())
                .orElse(null);

        String bookingDistrictCode = booking.getDistrictCode();
        String bookingWardCode = booking.getWardCode();

        if (bookingProvince != null && bookingProvince.getDistricts() != null && !bookingProvince.getDistricts().isEmpty()) {

            District bookingDistrict = districtRepository.findByCode(bookingDistrictCode);
            selectedBooking.setProvince(bookingProvince);

            if (bookingDistrict != null) {
                Ward bookingWard = wardRepository.findByCode((bookingWardCode));
                selectedBooking.setDistrict(bookingDistrict);
                selectedBooking.setWard(bookingWard);
            }
        }
        selectedBooking.setAddressDetail(booking.getAddressDetail());
        selectedBooking.setDriverName(booking.getName());
        selectedBooking.setDriverDob(booking.getDob());
        selectedBooking.setDriverPhone(booking.getPhone());
        selectedBooking.setDriverNationalId(booking.getNationalId());
        if (licenseFront != null && !licenseFront.isEmpty()) {
            if (selectedBooking.getDriverLicenseFront() != null) {
                carServiceImpl.deleteFileByUrl(selectedBooking.getDriverLicenseFront());
            }
            String path = util.uploadImage(licenseFront);
            selectedBooking.setDriverLicenseFront(path);
        }
        if (licenseBack != null && !licenseBack.isEmpty()) {
            if (selectedBooking.getDriverLicenseBack() != null) {
                carServiceImpl.deleteFileByUrl(selectedBooking.getDriverLicenseBack());
            }
            String path = util.uploadImage(licenseBack);
            selectedBooking.setDriverLicenseBack(path);
        }
        if (booking.getDriverId() != null) {
            if (selectedBooking.getDriverStatus() == null || selectedBooking.getDriverStatus().equals(DriverStatus.CANCEL) || selectedBooking.getDriverStatus().equals(DriverStatus.PENDING)) {
                User oldDriver = selectedBooking.getDriver();
                if (booking.getDriverId() != 0) {
                    if (oldDriver != null) {
                        sendOldDriverMail(oldDriver);
                        if (selectedBooking.getDriverStatus() != DriverStatus.CANCEL) {
                            DriverBooking driverBooking = findByBookingAndDriver(selectedBooking.getId(), oldDriver.getId());
                            driverBooking.setStatus(DriverBookingStatus.CANCELLED);
                            driverBookingRepository.save(driverBooking);
                        }
                    }

                    User driverUser = userRepository.findUserByDriverId(booking.getDriverId());
                    selectedBooking.setDriver(driverUser);
                    selectedBooking.setDriverFee(driverUser.getPrice());
                    selectedBooking.setDriverLateFee(driverUser.getLateFee());
                    selectedBooking.setDriverStatus(DriverStatus.PENDING);
                    DriverBooking driverBooking = new DriverBooking(DriverBookingStatus.PENDING, selectedBooking, driverUser);
                    driverBookingRepository.save(driverBooking);


                } else {
                    if (oldDriver != null) {
                        sendOldDriverMail(oldDriver);
                        if (selectedBooking.getDriverStatus() != DriverStatus.CANCEL) {
                            DriverBooking driverBooking = findByBookingAndDriver(selectedBooking.getId(), oldDriver.getId());
                            driverBooking.setStatus(DriverBookingStatus.CANCELLED);
                            driverBookingRepository.save(driverBooking);
                        }
                    }
                    selectedBooking.setDriver(null);
                    selectedBooking.setDriverStatus(null);
                }
            } else {
                throw new ApiException(400, "Your driver is confirmed, You are not allowed to change driver status");
            }
        }
        bookingRepository.save(selectedBooking);
        List<CarImages> imgLs = selectedBooking.getCar().getCarImages();
        if (imgLs.isEmpty()) throw new ApiException(400, "Car image list is empty");
        List<String> allOfImgCar = new ArrayList<>();
        for (CarImages img : imgLs) {
            if (img.getType().equals(CarImageType.CAR_IMAGE)) {
                allOfImgCar.add(img.getImageUrl());
            }
        }
        return new BookingResponse(
                selectedBooking.getId(),
                selectedBooking.getCar().getName(),
                convertToLocalDate(selectedBooking.getStartDate()),
                convertToLocalDate(selectedBooking.getEndDate()),
                selectedBooking.getBasePrice(),
                selectedBooking.getDeposit(),
                selectedBooking.getStatus(),
                selectedBooking.getCar().getId(),
                allOfImgCar
        );
    }


    //ANHCP2
    @Override
    @Transactional
    public void confirmDepositByCarOwner(int bookingId) throws ApiException {
        Booking booking = bookingRepository.findByIdAndStatus(bookingId, BookingStatus.PENDING_DEPOSIT)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "Booking is not pending deposit."));
        booking.setCarOwnerStatus(CarOwnerStatus.CONFIRM);
        if (booking.getDriver() == null || booking.getDriverStatus() == DriverStatus.CONFIRM) {
            booking.setStatus(BookingStatus.CONFIRMED);
        }
        bookingRepository.save(booking);
        emailService.sendEmail(
                booking.getUser().getEmail(),
                "Deposit Confirmed",
                "<h1>Your deposit has been confirmed!</h1>" +
                        "<p>Your booking status has been updated accordingly.</p>"
        );
    }

    @Override
    @Transactional
    public void confirmBookingByDriver(int bookingId) throws ApiException {
        Booking booking = bookingRepository.findByIdAndStatus(bookingId, BookingStatus.PENDING_DEPOSIT)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "Booking is not pending deposit."));

        booking.setDriverStatus(DriverStatus.CONFIRM);

        DriverBooking d = driverBookingRepository.getDriverBookingByBookedId(booking.getId());
        d.setStatus(DriverBookingStatus.APPROVED);


        if (booking.getCarOwnerStatus() == CarOwnerStatus.CONFIRM) {
            booking.setStatus(BookingStatus.CONFIRMED);
        }
        driverBookingRepository.save(d);
        bookingRepository.save(booking);
        emailService.sendEmail(
                booking.getUser().getEmail(),
                "Booking Confirmed by Driver",
                "<h1>Your driver has confirmed the booking!</h1>" +
                        "<p>Your booking status has been updated accordingly.</p>"
        );
    }


    @Transactional
    @Override
    public void confirmPayment(int bookingId) throws ApiException {
        Booking booking = bookingRepository.findByIdAndStatus(bookingId, BookingStatus.PENDING_PAYMENT)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "This booking is not pending payment."));
        booking.setStatus(BookingStatus.COMPLETED);
        bookingRepository.save(booking);
        User customer = booking.getUser();
        emailService.sendEmail(
                customer.getEmail(),
                "Payment Confirmation",
                "<h1>Your payment has been confirmed!</h1>" +
                        "<p>Your booking is now completed, and the car is available for rental again.</p>" +
                        "<p>Thank you for using our service!</p>"
        );
    }


    @Override
    public void confirmPickup(int bookingId) throws ApiException {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "Booking not found."));
        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            booking.setStatus(BookingStatus.IN_PROGRESS);
        } else {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Booking is not confirmed.");
        }
        bookingRepository.save(booking);
        User user = booking.getUser();
        emailService.sendEmail(
                user.getEmail(),
                "Pick-up Confirmation",
                "<h1>Your pick-up has been confirmed!</h1>" +
                        "<p>You have successfully confirmed the car pick-up.</p>" +
                        "<p>Please return the car on the agreed date and time.</p>"
        );
    }

    @Transactional(rollbackFor = ApiException.class)
    @Override
    public BookingResponse rentACar(String token, BookingRequestDTO bookingRequest, int paymentChoice, String voucherCode) throws ApiException {
        Booking newBooking = new Booking();
        String front = null;
        String back = null;
        User currentUser = userRepository.findByEmail(jwtService.getEmailFromToken(token));

        Car currentCar = carRepository.findById(bookingRequest.getCarId())
                .orElseThrow(() -> new ApiException(400, "Car cannot found"));

        User currentCarOwner = currentCar.getUser();

        User driverUser = userRepository.findById(bookingRequest.getDriverId())
                .orElse(null);

        Voucher selectedVoucher = null;

        if (currentUser == null) {
            throw new ApiException(400, "User not found");
        }
        if (bookingRequest == null) throw new ApiException(400, "Booking is null");

        if (currentCarOwner == null) {
            throw new ApiException(400, "Car owner not found");
        }
        if (!currentCar.getStatus().equals(CarStatus.AVAILABLE)) {
            throw new ApiException(400, "Car is not in available state");
        }
        if (currentCarOwner.getStatus().equals(UserStatus.INACTIVE)) {
            throw new ApiException(400, "Car owner is inactive so you cannot rent this car, sorry for that!");
        }
        if (!Pattern.matches("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", bookingRequest.getEmail())) {
            throw new ApiException(400, "Email is invalid format. Please try again");
        }

        if (!Pattern.matches("\\d{10}", bookingRequest.getPhone())) {
            throw new ApiException(400, "Phone number is invalid. Please try again");
        }

        if (!voucherCode.isBlank()) {
            selectedVoucher = voucherRepository.getVoucherByCode(voucherCode);
            if (selectedVoucher == null) {
                throw new ApiException(400, "Voucher is invalid");
            }
        }

        List<Booking> allBookings = bookingRepository.findAll();
        for (Booking existingBooking : allBookings) {
            boolean isStrictOverlapping = bookingRequest.getFrom().before(existingBooking.getEndDate()) &&
                    bookingRequest.getTo().after(existingBooking.getStartDate());

            boolean isTouchingEdge = bookingRequest.getFrom().equals(existingBooking.getEndDate()) ||
                    bookingRequest.getTo().equals(existingBooking.getStartDate());

            if (existingBooking.getStatus().equals(BookingStatus.CANCELLED) ||
                    existingBooking.getStatus().equals(BookingStatus.COMPLETED)) {
                continue;
            }
            if (existingBooking.getCar().getId() != currentCar.getId()) {
                continue;
            }
            if (isStrictOverlapping || isTouchingEdge) {
                throw new ApiException(400, "Booking time overlaps with another booking.");
            }
        }

        long oneDayInMillis = 24 * 60 * 60 * 1000L;
        int MAX_RENTAL_DAYS = 30;
        Date fromDate = bookingRequest.getFrom();
        Date toDate = bookingRequest.getTo();
        long rentalDurationInMillis = toDate.getTime() - fromDate.getTime();
        long rentalDays = rentalDurationInMillis / oneDayInMillis;

        if (bookingRequest.getFrom().before(new Date())) {
            throw new ApiException(400, "The selected date and time cannot be in the past.");
        }
        if (rentalDays > MAX_RENTAL_DAYS) {
            throw new ApiException(400, "The maximum rental period is " + MAX_RENTAL_DAYS + " days.");
        }
        if (bookingRequest.getFrom().after(bookingRequest.getTo())) {
            throw new ApiException(400, "Start date and time must be before the end date and time.");
        }
        if (bookingRequest.getFrom().equals(bookingRequest.getTo())) {
            throw new ApiException(400, "Start time and end Time must be different.");
        }

        Province bookingProvince = null;
        if (bookingRequest.getProvinceCode() != null && !bookingRequest.getProvinceCode().isEmpty()) {
            bookingProvince = (Province) provinceRepository.findByCode(bookingRequest.getProvinceCode())
                    .orElseThrow(() -> new ApiException(400, "Province not found"));
        }

        District bookingDistrict = null;
        if (bookingRequest.getDistrictCode() != null && !bookingRequest.getDistrictCode().isEmpty()) {
            bookingDistrict = (District) districtRepository.findByCode(bookingRequest.getDistrictCode());
            if (bookingDistrict == null) {
                throw new ApiException(400, "District not found");
            }
        }
        List<Ward> warDistrict = null;
        if (bookingDistrict != null) {
            warDistrict = bookingDistrict.getWards();
        }

        double deposit = currentCar.getDeposit();

        switch (paymentChoice) {
            case 1:
                Wallet userWallet = walletRepository.findById(currentUser.getWallet().getId())
                        .orElseThrow(() -> new ApiException(400, "Invalid wallet"));
                if (userWallet.getBalance() < deposit) {
                    throw new ApiException(400, "Insufficient");
                }
                userWallet.setBalance(userWallet.getBalance() - deposit);
                WalletHistory userWalletHistory = new WalletHistory();
                userWalletHistory.setBooking(newBooking);
                userWalletHistory.setWallet(userWallet);
                userWalletHistory.setAmount(deposit * -1);
                userWalletHistory.setType(WalletHistoryType.DEPOSIT);

                newBooking.setDeposit(deposit);

                WalletDeposit newBookingWalletDeposit = new WalletDeposit();
                newBookingWalletDeposit.setDepositAmount(deposit);
                newBookingWalletDeposit.setBooking(newBooking);
                newBookingWalletDeposit.setStatus(WalletDepositStatus.PENDING);
                walletDepositRepository.save(newBookingWalletDeposit);

                walletHistoryRepository.save(userWalletHistory);
                walletRepository.save(userWallet);
                break;
            case 2: // Cash
                break;
            case 3: // Bank transfer
                break;

            default:
                throw new ApiException(400, "Invalid payment choice");
        }


        if (front == null && back == null) {
            List<UserImages> listLicenseImage = currentUser.getUserImages();
            List<UserImages> licenseImages = new ArrayList<>();

            for (UserImages userImage : listLicenseImage) {
                if (userImage.getType().equals(UserImageType.LICENSE_DRIVER)) {
                    licenseImages.add(userImage);
                }
            }

            if (licenseImages.size() > 0) {
                front = licenseImages.get(0).getImageUrl();
                back = licenseImages.get(1).getImageUrl();
            }

        }
        double driverFee = driverUser != null ? driverUser.getPrice() : 0;
        double driverLateFee = driverUser != null ? driverUser.getLateFee() : 0;

        List<CarTermOfUse> carTermOfUses = currentCar.getCarTermOfUses();
        CarTermOfUse term = null;
        for (CarTermOfUse t : carTermOfUses) {
            if (t.getTermOfUseType().equals(TermOfUseType.LATE_FEE)) {
                term = t;
            }
        }

        double carLateFee = term.getValue();

        long numDays = ChronoUnit.DAYS.between(convertToLocalDate(bookingRequest.getFrom()), convertToLocalDate(bookingRequest.getTo()));

        if (numDays <= 0) numDays = 1;



        if (selectedVoucher != null) {
            newBooking.setVoucherId(selectedVoucher.getId());
            double maxPrice = selectedVoucher.getMaxPrice();
            double discount = 0.0;
            List<Car> carCanApplyVoucher = selectedVoucher.getCars();
            List<Integer> listModelIds = selectedVoucher.getModels().stream().map(carModel -> carModel.getId()).toList();

            System.out.println(listModelIds);
            System.out.println(bookingRequest.getCarId());
            if (selectedVoucher.getType().equals(VoucherType.CAR_OWNER_VOUCHER)) {
                if (!carCanApplyVoucher.isEmpty()) {
                    if (!carCanApplyVoucher.contains(currentCar)) {
                        throw new ApiException(400, "This car cannot apply this voucher");
                    }
                }
            }

            if (selectedVoucher.getType().equals(VoucherType.ADMIN_VOUCHER)) {
                if (!listModelIds.isEmpty()) {
                    if (!listModelIds.contains(currentCar.getCarModel().getId())) {
                        throw new ApiException(400, "This model cannot apply this voucher");
                    }
                }

                if (selectedVoucher.getBrand() != null) {
                    if (!currentCar.getCarModel().getBrand().equals(selectedVoucher.getBrand())) {
                        throw new ApiException(400, "This brand cannot apply this voucher");
                    }
                }
            }
            if (selectedVoucher.getPercentRate() > 0) {
                discount = (currentCar.getBasePrice() * numDays) * (selectedVoucher.getPercentRate() / 100);

                if (maxPrice > 0 && discount > maxPrice) {
                    discount = maxPrice;
                }
            } else {
                discount = selectedVoucher.getFixedPrice();
            }
            newBooking.setDiscount(discount);
        }


        newBooking.setUser(currentUser);
        newBooking.setDriverName(currentUser.getName());
        newBooking.setDriverDob(currentUser.getDob());
        newBooking.setDriverPhone(bookingRequest.getPhone());
        newBooking.setDriverEmail(currentUser.getEmail());
        newBooking.setDriverNationalId(currentUser.getNationalId());
        newBooking.setDriverLicenseFront(front);
        newBooking.setDriverLicenseBack(back);
        newBooking.setStartDate(bookingRequest.getFrom());
        newBooking.setEndDate(bookingRequest.getTo());
        newBooking.setDriver(driverUser);
        newBooking.setStatus(BookingStatus.PENDING_DEPOSIT);
        newBooking.setCar(currentCar);
        newBooking.setCarOwner(currentCarOwner);
        newBooking.setWard(warDistrict == null ? null : warDistrict.get(0));
        newBooking.setAddressDetail(currentUser.getAddressDetail());
        newBooking.setProvince(bookingProvince);
        newBooking.setDistrict(bookingDistrict);
        newBooking.setBasePrice(currentCar.getBasePrice());
        newBooking.setCarOwnerStatus(CarOwnerStatus.PENDING);
        newBooking.setDriverFee(driverFee);
        newBooking.setDriverLateFee(driverLateFee);
        newBooking.setCarLateFee(carLateFee);

        //check is overlaps driver's time?
        if (driverUser != null) {
            DriverBooking newDriverBooking = new DriverBooking();
            for (Booking booked : allBookings) {
                if (!(booked.getStatus().equals(BookingStatus.CANCELLED) || booked.getStatus().equals(BookingStatus.COMPLETED)) &&
                        booked.getDriver() != null &&
                        booked.getDriver().getId() == driverUser.getId()) {
                    boolean isDriverOverlapping = bookingRequest.getFrom().before(booked.getEndDate()) &&
                            bookingRequest.getTo().after(booked.getStartDate());
                    if (isDriverOverlapping) {
                        throw new ApiException(400, "Driver is already booked for another trip at new booking time.");
                    }
                }
            }
            newBooking.setDriverStatus(DriverStatus.PENDING);

            newDriverBooking.setUser(driverUser);
            newDriverBooking.setBooking(newBooking);
            newDriverBooking.setStatus(DriverBookingStatus.PENDING);
            driverBookingRepository.save(newDriverBooking);
        }

        bookingRepository.save(newBooking);

        emailService.sendEmail(
                currentUser.getEmail(),
                "Booking Confirmation",
                "<h1>Congratulations! You have booked " + currentCar.getName() + "</h1>" +
                        "<p>Start Date: " + newBooking.getStartDate() + "</p>" +
                        "<p>End Date: " + newBooking.getEndDate() + "</p>" +
                        "<p>Thank you for using our service!</p>"
        );

        emailService.sendEmail(
                currentCarOwner.getEmail(),
                "Your car has been booked!",
                "<h1>Congratulations! Your car " + currentCar.getName() + " has been booked.</h1>" +
                        "<p>Start Date: " + newBooking.getStartDate() + "</p>" +
                        "<p>End Date: " + newBooking.getEndDate() + "</p>" +
                        "<p>Please check your account for the deposit.</p>"
        );

        List<String> carImages = new ArrayList<>();
        for (CarImages img : currentCar.getCarImages()) {
            if (img.getType().equals(CarImageType.CAR_IMAGE)) {
                carImages.add(img.getImageUrl());
            }
        }

        return new BookingResponse(
                newBooking.getId(),
                currentCar.getName(),
                convertToLocalDate(newBooking.getStartDate()),
                convertToLocalDate(newBooking.getEndDate()),
                newBooking.getBasePrice(),
                newBooking.getDeposit(),
                newBooking.getStatus(),
                currentCar.getId(),
                carImages
        );
    }

    @Transactional(rollbackFor = ApiException.class)
    @Override
    public String cancelBoookingForCustomer(String token, int bookingId) throws ApiException {
        Booking selectCancelBooking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ApiException(400, "Booking cannot found"));
        User currentUserOfBooking = userRepository.findByEmail(jwtService.getEmailFromToken(token));
        User currentCarOwnerOfBooking = selectCancelBooking.getCarOwner();
        User currentDriver = selectCancelBooking.getDriver();
        if (currentCarOwnerOfBooking == null) {
            throw new ApiException(400, "Car owner cannot found");
        }
        if (currentUserOfBooking == null) {
            throw new ApiException(400, "User not found");
        }

        if (!((selectCancelBooking.getStatus().equals(BookingStatus.PENDING_DEPOSIT)) || (selectCancelBooking.getStatus().equals(BookingStatus.CONFIRMED)))) {
            throw new ApiException(400, "Booking was confirmed!");
        }
        if (selectCancelBooking.getStatus().equals(BookingStatus.CANCELLED)) {
            throw new ApiException(400, "Current booking was cancelled in the past");
        }
        //CANCEL FREE
        if (selectCancelBooking.getCarOwnerStatus().equals(CarOwnerStatus.PENDING)) {
            Wallet userBookingWallet = selectCancelBooking.getUser().getWallet();
            WalletHistory newUserWalletHistory = new WalletHistory();
            WalletDeposit bookingWalletDeposit = selectCancelBooking.getWalletDeposit();
            DriverBooking driverBookingAtTime = driverBookingRepository.getDriverBookingByBookedId(selectCancelBooking.getId());

            double refundFree = bookingWalletDeposit.getDepositAmount();
            userBookingWallet.setBalance(userBookingWallet.getBalance() + refundFree);

            newUserWalletHistory.setWallet(userBookingWallet);
            newUserWalletHistory.setBooking(selectCancelBooking);
            newUserWalletHistory.setAmount(refundFree);
            newUserWalletHistory.setType(WalletHistoryType.DEPOSIT_WITHDRAWAL);

            bookingWalletDeposit.setStatus(WalletDepositStatus.DONE);
            selectCancelBooking.setStatus(BookingStatus.CANCELLED);

            if (driverBookingAtTime != null) {
                driverBookingAtTime.setStatus(DriverBookingStatus.CANCELLED);
                driverBookingRepository.save(driverBookingAtTime);
            }

            bookingRepository.save(selectCancelBooking);
            walletDepositRepository.save(bookingWalletDeposit);
            walletRepository.save(userBookingWallet);
            walletHistoryRepository.save(newUserWalletHistory);

            emailService.sendEmail(
                    currentCarOwnerOfBooking.getEmail(),
                    "Booking Cancellation Notice",
                    "<h1>Booking Cancellation Notification</h1>" +
                            "<p>The customer has canceled your booking due to personal reasons.</p>" +
                            "<p>Please confimrm that you're confirm or reject this booking now.</p>" +
                            "<p>We apologize for the inconvenience.</p>"
            );
            if (currentDriver != null) {
                emailService.sendEmail(
                        currentDriver.getEmail(),
                        "Booking Cancellation Notice",
                        "<h1>Booking Cancellation Notification</h1>" +
                                "<p>The customer has canceled your booking due to personal reasons.</p>" +
                                "<p>We apologize for the inconvenience.</p>"
                );
            }
            return "Cancel by customer successfully";
        }
        //CANCEL WAIT APPROVE BY CAR OWNER
        emailService.sendEmail(
                currentCarOwnerOfBooking.getEmail(),
                "Booking Cancellation Notice",
                "<h1>Booking Cancellation Notification</h1>" +
                        "<p>The customer has canceled your booking due to personal reasons.</p>" +
                        "<p>Please confimrm that you're confirm or reject this booking now.</p>" +
                        "<p>We apologize for the inconvenience.</p>"
        );

        CancelBooking newCancelBooking = new CancelBooking();
        newCancelBooking.setChoice(0);
        newCancelBooking.setBooking(selectCancelBooking);
        newCancelBooking.setStatus(CancelBookingStatus.PENDING);

        cancelBookingReposiroty.save(newCancelBooking);
        bookingRepository.save(selectCancelBooking);
        return "Cancel sucessfully";
    }

    @Transactional(rollbackFor = ApiException.class)
    @Override
    public String handleCancelBookingByCarOwner(String token, int bookingId, int choice) throws ApiException {
        Booking selectedBooking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ApiException(400, "Booking cannot found"));
        User currentUser = selectedBooking.getUser();
        User currentDriver = selectedBooking.getDriver();
        User currentCarowner = userRepository.findByEmail(jwtService.getEmailFromToken(token));
        Wallet userWallet = selectedBooking.getUser().getWallet();
        Wallet carOwnerWallet = selectedBooking.getCarOwner().getWallet();
        WalletHistory userWalletHistory = new WalletHistory();
        WalletHistory carOwnerWalletHistory = new WalletHistory();
        WalletDeposit walletDepositBooking = selectedBooking.getWalletDeposit();
        CancelBooking currentCancelBooking = selectedBooking.getCancelBooking();
        DriverBooking driverBookingAtTime = driverBookingRepository.getDriverBookingByBookedId(selectedBooking.getId());
        if (currentUser == null) {
            throw new ApiException(400, "User cannot found");
        }
        if (currentCarowner == null) {
            throw new ApiException(400, "Car owner cannot found");
        }
        if (userWallet == null) {
            throw new ApiException(400, "User wallet cannot found");
        }
        if (carOwnerWallet == null) {
            throw new ApiException(400, "Car owner wallet cannot found");
        }
        if (walletDepositBooking == null) {
            throw new ApiException(400, "Wallet Deposit cannot found");
        }
        if (currentCancelBooking == null) {
            throw new ApiException(400, "Cancel booking cannot found");
        }
        if (!(selectedBooking.getStatus().equals(BookingStatus.PENDING_DEPOSIT)
                || selectedBooking.getStatus().equals(BookingStatus.CONFIRMED))) {
            throw new ApiException(400, "Booking was in-progresss");
        }

        if (selectedBooking.getStatus().equals(BookingStatus.CANCELLED)) {
            throw new ApiException(400, "Current booking was cancelled in the past");
        }

        switch (choice) {
            case 1:
                selectedBooking.setStatus(BookingStatus.CANCELLED);
                userWallet.setBalance(userWallet.getBalance() + walletDepositBooking.getDepositAmount());
                walletDepositBooking.setStatus(WalletDepositStatus.DONE);
                currentCancelBooking.setStatus(CancelBookingStatus.DONE);
                selectedBooking.setDriverStatus(DriverStatus.CANCEL);
                selectedBooking.setCarOwnerStatus(CarOwnerStatus.CANCEL);
                currentCancelBooking.setChoice(1);
                userWalletHistory.setWallet(userWallet);
                userWalletHistory.setAmount(walletDepositBooking.getDepositAmount());
                userWalletHistory.setType(WalletHistoryType.DEPOSIT_WITHDRAWAL);
                userWalletHistory.setBooking(selectedBooking);
                walletRepository.save(userWallet);
                walletHistoryRepository.save(userWalletHistory);
                emailService.sendEmail(
                        currentUser.getEmail(),
                        "Booking Cancellation Notice",
                        "<h1>Booking Cancellation Notification</h1>" +
                                "<p>The car owner has approve and cancel your booking.</p>" +
                                "<p>Please confimrm that you have get full of refund equal: " + walletDepositBooking.getDepositAmount() + ".</p>" +
                                "<p>We apologize for the inconvenience.</p>"
                );
                if (currentDriver != null) {
                    driverBookingAtTime.setStatus(DriverBookingStatus.CANCELLED);
                    driverBookingRepository.save(driverBookingAtTime);
                    emailService.sendEmail(
                            currentDriver.getEmail(),
                            "Booking Cancellation Notice",
                            "<h1>Booking Cancellation Notification</h1>" +
                                    "<p>The customer has canceled your booking due to personal reasons.</p>" +
                                    "<p>We apologize for the inconvenience.</p>"
                    );
                }
                break;
            case 2:
                selectedBooking.setStatus(BookingStatus.CANCELLED);
                carOwnerWallet.setBalance(userWallet.getBalance() + walletDepositBooking.getDepositAmount());
                walletDepositBooking.setStatus(WalletDepositStatus.DONE);
                currentCancelBooking.setStatus(CancelBookingStatus.DONE);
                selectedBooking.setDriverStatus(DriverStatus.CANCEL);
                selectedBooking.setCarOwnerStatus(CarOwnerStatus.CANCEL);
                currentCancelBooking.setChoice(2);
                carOwnerWalletHistory.setWallet(carOwnerWallet);
                carOwnerWalletHistory.setAmount(walletDepositBooking.getDepositAmount());
                carOwnerWalletHistory.setType(WalletHistoryType.DEPOSIT_WITHDRAWAL);
                carOwnerWalletHistory.setBooking(selectedBooking);
                walletRepository.save(carOwnerWallet);
                walletHistoryRepository.save(carOwnerWalletHistory);
                emailService.sendEmail(
                        currentUser.getEmail(),
                        "Booking Cancellation Notice",
                        "<h1>Booking Cancellation Notification</h1>" +
                                "<p>The car owner has approve and cancel your booking.</p>" +
                                "<p>Your refund is revoke because your booking is policy violations!</p>" +
                                "<p>We apologize for the inconvenience.</p>"
                );
                if (currentDriver != null) {
                    driverBookingAtTime.setStatus(DriverBookingStatus.CANCELLED);
                    driverBookingRepository.save(driverBookingAtTime);
                    emailService.sendEmail(
                            currentDriver.getEmail(),
                            "Booking Cancellation Notice",
                            "<h1>Booking Cancellation Notification</h1>" +
                                    "<p>The customer has canceled your booking due to personal reasons.</p>" +
                                    "<p>We apologize for the inconvenience.</p>"
                    );
                }
                break;
            case 3:
                currentCancelBooking.setChoice(3);
                currentCancelBooking.setStatus(CancelBookingStatus.DONE);
                emailService.sendEmail(
                        currentUser.getEmail(),
                        "Booking Cancellation Notice",
                        "<h1>Booking Cancellation Notification</h1>" +
                                "<p>The car owner has reject your booking and it is continue.</p>" +
                                "<p>We apologize for the inconvenience.</p>"
                );
                break;
        }

        bookingRepository.save(selectedBooking);
        walletDepositRepository.save(walletDepositBooking);
        cancelBookingReposiroty.save(currentCancelBooking);
        return "handle cancel successfully";
    }

    @Transactional(rollbackFor = ApiException.class)
    @Override
    public String rejectByCarOwner(String token, int bookingId) throws ApiException {
        Booking selectCancelBooking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ApiException(400, "Booking cannot found"));

        User currentUserOfBooking = selectCancelBooking.getUser();

        double deposit = selectCancelBooking.getWalletDeposit().getDepositAmount();
        if (currentUserOfBooking == null) {
            throw new ApiException(400, "User not found");
        }

        Wallet userWallet = selectCancelBooking.getUser().getWallet();
        if (userWallet == null) {
            throw new ApiException(400, "User wallet cannot found");
        }

        WalletHistory userWalletHistory = new WalletHistory();
        if (!(selectCancelBooking.getStatus().equals(BookingStatus.PENDING_DEPOSIT)
                || selectCancelBooking.getStatus().equals(BookingStatus.CONFIRMED))) {
            throw new ApiException(400, "Booking was in-progresss");
        }

        if (selectCancelBooking.getStatus().equals(BookingStatus.CANCELLED)) {
            throw new ApiException(400, "Current booking was cancelled in the past");
        }

        emailService.sendEmail(
                currentUserOfBooking.getEmail(),
                "Booking Cancellation Notice",
                "<h1>Booking Cancellation Notification</h1>" +
                        "<p>The car owner has canceled your booking due to personal reasons.</p>" +
                        "<p>Please book another trip as soon as possible to avoid any disruptions.</p>" +
                        "<p><a href='http://localhost:8080/home' alt='Booking Now'>Booking Now</a></p>" +
                        "<p>The deposit amount has been refunded to your account by the system.</p>" +
                        "<p>We apologize for the inconvenience.</p>"
        );
        User currentDriverOfBooking = selectCancelBooking.getDriver();
        if (currentDriverOfBooking != null) {
            emailService.sendEmail(
                    currentDriverOfBooking.getEmail(),
                    "Booking Cancellation Notice",
                    "<h1>Booking Cancellation Notification</h1>" +
                            "<p>The car owner has canceled your booking due to personal reasons.</p>" +
                            "<p>We apologize for the inconvenience.</p>"
            );

        }
        userWallet.setBalance(userWallet.getBalance() + deposit);
        userWalletHistory.setBooking(selectCancelBooking);
        userWalletHistory.setAmount(deposit * 1);
        userWalletHistory.setWallet(userWallet);
        userWalletHistory.setType(WalletHistoryType.DEPOSIT_WITHDRAWAL);
        selectCancelBooking.setCarOwnerStatus(CarOwnerStatus.CANCEL);
        selectCancelBooking.setStatus(BookingStatus.CANCELLED);
        WalletDeposit cancelWalletDeposit = selectCancelBooking.getWalletDeposit();
        cancelWalletDeposit.setStatus(WalletDepositStatus.DONE);

        bookingRepository.save(selectCancelBooking);
        walletRepository.save(userWallet);
        walletHistoryRepository.save(userWalletHistory);
        walletDepositRepository.save(cancelWalletDeposit);
        return "Cancel sucessfully";
    }

    @Override
    public String rejectByDriver(String token, int bookingId) throws ApiException {
        Booking currentBooking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ApiException(400, "Booking not found"));

        DriverBooking bookingDriverReject = driverBookingRepository.getDriverBookingByBookedId(currentBooking.getId());

        User userGetNotify = currentBooking.getUser();

        if (userGetNotify == null) {
            throw new ApiException(400, "User cannot found");
        }
        User currentDriver = userRepository.findByEmail(jwtService.getEmailFromToken(token));
        if (currentDriver == null) {
            throw new ApiException(400, "Driver cannot found");
        }
        currentBooking.setDriverStatus(DriverStatus.CANCEL);
        bookingDriverReject.setStatus(DriverBookingStatus.REJECTED);
        driverBookingRepository.save(bookingDriverReject);
        bookingRepository.save(currentBooking);
        emailService.sendEmail(
                userGetNotify.getEmail(),
                "Driver Cancellation Notice",
                "<h1>Driver Cancellation Notification</h1>" +
                        "<p>The driver " + currentDriver.getName() + " assigned to your booking has canceled the service due to personal reasons.</p>" +
                        "<p>Please update your booking and select another driver.</p>" +
                        "<p><a href='http://localhost:5173/booking/" + bookingId + "' alt='Booking Detail'>View Booking Details</a></p>" +
                        "<p>We apologize for the inconvenience.</p>"
        );
        return "Cancel successfully";
    }


    @Transactional(rollbackFor = ApiException.class)
    @Override
    public BookingBillResponse returnCar(String token, int bookingId, Date actualTime) throws ApiException {
        Booking returnBooking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ApiException(400, "Booking not found"));

        if (actualTime == null) {
            throw new ApiException(400, "ActualTime is invalid");
        }

        if (returnBooking.getStatus() != BookingStatus.IN_PROGRESS) {
            throw new ApiException(400, "Booking is not in in-progress state");
        }

        // Lưu actualTime và cập nhật trạng thái thành PENDING_PAYMENT
        returnBooking.setActualTime(actualTime);
        returnBooking.setStatus(BookingStatus.PENDING_PAYMENT);
        bookingRepository.save(returnBooking);

        // Trả về thông tin booking mà không tính toán thêm
        return BookingBillResponse.builder()
                .id(returnBooking.getId())
                .from(convertToLocalDate(returnBooking.getStartDate()))
                .to(convertToLocalDate(returnBooking.getEndDate()))
                .actualTime(returnBooking.getActualTime().toString())
                .status(returnBooking.getStatus())
                .build();
    }

    @Transactional(rollbackFor = ApiException.class)
    @Override
    public String paidPayment(String token, int bookingId) throws ApiException {

        Booking returnBooking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ApiException(400, "Booking cannot found"));
        User currentUser = userRepository.findByEmail(jwtService.getEmailFromToken(token));
        User currentOwnerUser = returnBooking.getCarOwner();
        if (currentUser == null) {
            throw new ApiException(400, "User not found");
        }
        if (!returnBooking.getStatus().equals(BookingStatus.PENDING_PAYMENT)) {
            throw new ApiException(400, "Current booking not in pending payment state");
        }
        Wallet userWallet = currentUser.getWallet();
        if (userWallet == null) {
            throw new ApiException(400, "User Wallet not found");
        }
        Wallet ownerWallet = currentOwnerUser.getWallet();
        if (ownerWallet == null) {
            throw new ApiException(400, "User Wallet not found");
        }

        Wallet adminWallet = walletRepository.findByWalletType(UserWalletType.ADMIN_WALLET);
        if(adminWallet == null){
            throw new ApiException(400, "Admin wallet not found");
        }

        User currentDriver = returnBooking.getDriver();

        long numberOfDays = ChronoUnit.DAYS.between(convertToLocalDate(returnBooking.getStartDate()), convertToLocalDate(returnBooking.getEndDate()));

        if (numberOfDays <= 0) {
            numberOfDays = 1;
        }
        WalletHistory userWalletHistory = new WalletHistory();
        WalletHistory carOwnerWalletHistory = new WalletHistory();
        WalletHistory adminWalletHistory = new WalletHistory();

        LocalDateTime actualTime = convertToLocalDate(returnBooking.getActualTime());
        LocalDateTime endDateTime = convertToLocalDate(returnBooking.getEndDate());
        long lateHours = ChronoUnit.HOURS.between(endDateTime, actualTime);
        if (lateHours <= 0) {
            lateHours = 0;
        }

        WalletDeposit bookingWalletDeposit = returnBooking.getWalletDeposit();

        double carLateFee = returnBooking.getCarLateFee();
        //2 loai tien cua driver
        double driverPrice = returnBooking.getDriverFee();
        double driverLateFee = returnBooking.getDriverLateFee();
        //gia thue mot ngay
        double basePrice = returnBooking.getBasePrice();
        //tien coc
        double deposit = returnBooking.getDeposit();
        //phi tong cho driver
        double driverTotal = (driverPrice * numberOfDays) + (driverLateFee * lateHours);
        //phi tong cho carOwner
        double carTotal = (basePrice * numberOfDays) + (carLateFee * lateHours) - returnBooking.getDiscount();
        //total
        double totalAmount = driverTotal + carTotal;

        double totalAdminFee = ((basePrice * numberOfDays) * 0.03) + ((driverPrice * numberOfDays) * 0.03);

        double carServiceFee = (basePrice * numberOfDays) * 0.03;

        double driverServiceFee = (driverPrice * numberOfDays) * 0.03;
        if (totalAmount < deposit) {
            //user duoc hoan lai so tien sau do deposit > totalAmount
            double finalFeeForCustomer = deposit - totalAmount;
            userWallet.setBalance(userWallet.getBalance() + finalFeeForCustomer);
            userWalletHistory.setBooking(returnBooking);
            userWalletHistory.setType(WalletHistoryType.RENTED);
            userWalletHistory.setAmount(finalFeeForCustomer);
            userWalletHistory.setWallet(userWallet);
            ownerWallet.setBalance(ownerWallet.getBalance() + carTotal - carServiceFee);
            carOwnerWalletHistory.setBooking(returnBooking);
            carOwnerWalletHistory.setType(WalletHistoryType.RENTED);
            carOwnerWalletHistory.setAmount(carTotal - carServiceFee);
            carOwnerWalletHistory.setWallet(ownerWallet);
            if (currentDriver != null) {
                Wallet driverWallet = currentDriver.getWallet();
                WalletHistory driverWalletHistory = new WalletHistory();
                driverWallet.setBalance(driverWallet.getBalance() + driverTotal - driverServiceFee );
                driverWalletHistory.setWallet(driverWallet);
                driverWalletHistory.setBooking(returnBooking);
                driverWalletHistory.setAmount(driverTotal - driverServiceFee);
                driverWalletHistory.setType(WalletHistoryType.RENTED);
                walletRepository.save(driverWallet);
                walletHistoryRepository.save(driverWalletHistory);
            }
        } else if (totalAmount > deposit) {
            double finalFeeForCustomer = totalAmount - deposit;
            //neu so tien trong vi khong du
            if (userWallet.getBalance() < finalFeeForCustomer) {
                throw new ApiException(400, "insufficient, Top-up and try again");
            }
            //tru tien them tien user de du tra tien finalFee
            userWallet.setBalance(userWallet.getBalance() - finalFeeForCustomer);
            userWalletHistory.setBooking(returnBooking);
            userWalletHistory.setType(WalletHistoryType.RENTED);
            userWalletHistory.setAmount(-finalFeeForCustomer);
            userWalletHistory.setWallet(userWallet);
            ownerWallet.setBalance(ownerWallet.getBalance() + carTotal - carServiceFee);
            carOwnerWalletHistory.setBooking(returnBooking);
            carOwnerWalletHistory.setType(WalletHistoryType.RENTED);
            carOwnerWalletHistory.setAmount(carTotal - carServiceFee);
            carOwnerWalletHistory.setWallet(ownerWallet);
            //driver neu co
            if (currentDriver != null) {
                Wallet driverWallet = currentDriver.getWallet();
                WalletHistory driverWalletHistory = new WalletHistory();
                driverWallet.setBalance(driverWallet.getBalance() + driverTotal - driverServiceFee);
                driverWalletHistory.setWallet(driverWallet);
                driverWalletHistory.setBooking(returnBooking);
                driverWalletHistory.setAmount(driverTotal - driverServiceFee);
                driverWalletHistory.setType(WalletHistoryType.RENTED);
                walletRepository.save(driverWallet);
                walletHistoryRepository.save(driverWalletHistory);

            }
        }
        adminWallet.setBalance(adminWallet.getBalance() + totalAdminFee);
        adminWalletHistory.setAmount(totalAdminFee);
        adminWalletHistory.setBooking(returnBooking);
        adminWalletHistory.setType(WalletHistoryType.RENTED);
        adminWalletHistory.setWallet(adminWallet);
        returnBooking.setStatus(BookingStatus.COMPLETED);
        bookingWalletDeposit.setStatus(WalletDepositStatus.DONE);
        walletDepositRepository.save(bookingWalletDeposit);
        walletRepository.save(userWallet);
        walletRepository.save(ownerWallet);
        walletRepository.save(adminWallet);
        walletHistoryRepository.save(userWalletHistory);
        walletHistoryRepository.save(carOwnerWalletHistory);
        walletHistoryRepository.save(adminWalletHistory);
        bookingRepository.save(returnBooking);
        return "paid payment successfully";
    }

    @Override
    public BookingBillResponse returnBill(String token, int bookingId) throws ApiException {
        Booking returnBooking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ApiException(400, "Booking not found"));
        Car currentCar = returnBooking.getCar();
        //get term of use


        //---
        //get car late fee per hours
        Date actualTime = returnBooking.getActualTime();
        double carLateFeePerHour = carTermOfUseRepository.findLateFeeByCar(currentCar.getId()).getValue();
        double carLateFeeInBooking = returnBooking.getCarLateFee();
        //-----
        if (actualTime == null) {
            throw new ApiException(400, "ActualTime is invalid");
        }
        LocalDateTime startDate = convertToLocalDate(returnBooking.getStartDate());
        LocalDateTime returnTime = convertToLocalDate(returnBooking.getEndDate());
        LocalDateTime timeActual = convertToLocalDate(actualTime);
        Long lateHours = ChronoUnit.HOURS.between(returnTime, timeActual);

        System.out.println(lateHours);
        if (lateHours < 0) {
            lateHours = 0L;
        }
        //car late fee
        double carLateFee = carLateFeeInBooking * lateHours;

        long fullDay = ChronoUnit.DAYS.between(startDate, returnTime);
        long numDays = 0;
        if (fullDay <= 0) {
            numDays = 1;
        } else {
            numDays = fullDay;
        }
        User driver = returnBooking.getDriver();
        double driverLateFee = 0.0;
        double driverFeeSum = 0.0;

        double driverFeeInBooking = returnBooking.getDriverFee();
        double driverLateFeeInBooking = returnBooking.getDriverLateFee();
        if (driver != null) {
            driverLateFee = driverLateFeeInBooking * lateHours;
            driverFeeSum = (driverFeeInBooking * numDays) + driverLateFee;
        }

        double rentCarFeeSum = (returnBooking.getBasePrice() * numDays) + carLateFee - returnBooking.getDiscount();

        return BookingBillResponse.builder()
                .from(convertToLocalDate(returnBooking.getStartDate()))
                .to(convertToLocalDate(returnBooking.getEndDate()))
                .driverName(driver == null ? "" : driver.getName())
                .driverPhone(driver == null ? "" : driver.getPhone())
                .driverEmail(driver == null ? "" : driver.getEmail())
                .userName(returnBooking.getUser().getName())
                .userPhone(returnBooking.getUser().getPhone())
                .userEmail(returnBooking.getUser().getEmail())
                .basePrice(returnBooking.getBasePrice())
                .id(returnBooking.getId())
                .numberOfDays(numDays)
                .carName(returnBooking.getCar().getName())
                .status(returnBooking.getStatus())
                .deposit(returnBooking.getDeposit())
                .created_At(returnBooking.getCreatedAt().toString())
                .actualTime(returnBooking.getActualTime().toString())
                .car_late_fee(carLateFee)
                .total_car_fee(rentCarFeeSum)
                .driver_late_fee(driverLateFee)
                .total_driver_fee(driverFeeSum)
                .discount(returnBooking.getDiscount())
                .build();
    }


    @Override
    public List<DriverListReponse> SearchDriverByCategory(String token, String provinceCode, String districtCode, String wardCode) throws ApiException {
        List<User> lsUser = userRepository.searchDrivers(provinceCode, districtCode, wardCode);
        if (lsUser == null || lsUser.isEmpty()) {
            throw new ApiException(400, "No user found");
        }
        List<DriverListReponse> ls = new ArrayList<>();
        for (User u : lsUser) {
            ls.add(new DriverListReponse(u.getName(), u.getEmail(), u.getPhone(), u.getDriverExp(), u.getPrice(), u.getLateFee()));
        }
        if (ls == null || ls.isEmpty()) {
            throw new ApiException(400, "No driver found");
        }
        return ls;
    }

    @Override
    public List<DriverBookingResponse> viewDriverBooking(String token) throws ApiException {
        String email = jwtService.getEmailFromToken(token);
        User driver = userRepository.findByEmail(email);
        System.out.println(driver.getId());

        List<DriverBooking> lsDrvBK = driverBookingRepository.getAllByDriverId(driver.getId());
        List<DriverBookingResponse> ls = new ArrayList<>();

        for (DriverBooking driverBooking : lsDrvBK) {
            Booking bookingfromDRVBK = driverBooking.getBooking();
            List<CarImages> imgLs = bookingfromDRVBK.getCar().getCarImages();
            List<String> allOfImgCar = new ArrayList<>();
            if (imgLs.isEmpty()) {
                throw new ApiException(400, "Car image list is empty");
            }

            for (CarImages img : imgLs) {
                if (img.getType().equals(CarImageType.CAR_IMAGE)) {
                    allOfImgCar.add(img.getImageUrl());
                }
            }
            WalletDeposit currentWalletDeposit = bookingfromDRVBK.getWalletDeposit();
            if (currentWalletDeposit == null) {
                throw new ApiException(400, "Current wallet deposit cannot found");
            }
            CancelBooking currentCancelBooking = bookingfromDRVBK.getCancelBooking();
            ls.add(new DriverBookingResponse(
                    driverBooking.getBooking().getId(),
                    driverBooking.getBooking().getCar().getName(),
                    convertToLocalDate(driverBooking.getBooking().getStartDate()),
                    convertToLocalDate(driverBooking.getBooking().getEndDate()),
                    driverBooking.getBooking().getBasePrice(),
                    driverBooking.getBooking().getDeposit(),
                    driverBooking.getBooking().getStatus(),
                    driverBooking.getBooking().getCar().getId(),
                    driverBooking.getBooking().getCar().getUser().getName(),
                    driverBooking.getBooking().getCar().getUser().getEmail(),
                    allOfImgCar,
                    currentWalletDeposit.getDepositAmount(),
                    currentWalletDeposit.getStatus(),
                    (currentCancelBooking != null) ? currentCancelBooking.getChoice() : 0,
                    (currentCancelBooking != null) ? currentCancelBooking.getStatus() : null,
                    (driverBooking != null) ? driverBooking.getStatus() : null,
                    driverBooking.getBooking().getCarOwnerStatus(),
                    bookingfromDRVBK.getDriverFee()
            ));
        }

        return ls;
    }

    @Override
    public CarOwnerStatus checkCarOwnerStatus(int bookingId) throws ApiException {
        Booking booking_need_check = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ApiException(400, "Booking_need_check cannot found"));

        return booking_need_check.getCarOwnerStatus();
    }

    @Override
    public String changeStatusRentCar(int carId) throws ApiException {
        Car carWillStopped = carRepository.findById(carId)
                .orElseThrow(() -> new ApiException(400, "Car cannot found"));
        if (carWillStopped.getStatus().equals(CarStatus.STOPPED)) {
            carWillStopped.setStatus(CarStatus.AVAILABLE);
        } else if (carWillStopped.getStatus().equals(CarStatus.AVAILABLE)) {
            carWillStopped.setStatus(CarStatus.STOPPED);
        }
        carRepository.save(carWillStopped);
        return "Change car status succesfully";
    }


    @Override
    public BookingInfoResponse getBookingInfo(String token, int bookingId) throws ApiException {
        Booking finishBooking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ApiException(400, "Invalid booking"));

        List<CarImages> imgLs = finishBooking.getCar().getCarImages();
        if (imgLs.isEmpty()) throw new ApiException(400, "Car image list is empty");
        List<String> allOfImgCar = new ArrayList<>();
        for (CarImages img : imgLs) {
            if (img.getType().equals(CarImageType.CAR_IMAGE)) {
                allOfImgCar.add(img.getImageUrl());
            }
        }
        long noOfDays = ChronoUnit.DAYS.between(convertToLocalDate(finishBooking.getStartDate()), convertToLocalDate(finishBooking.getEndDate()));
        double totalPrice = finishBooking.getBasePrice() * noOfDays;
        List<String> listDriverLicense = new ArrayList<>();
        if (finishBooking.getDriver() != null) {
            totalPrice += finishBooking.getDriver().getPrice() * noOfDays;
            List<UserImages> list = userImagesRepository.findDrivingLicenseByUserId(finishBooking.getDriver().getId());
            listDriverLicense.addAll(list.stream().map(UserImages::getImageUrl).toList());
        }
        int userId = finishBooking.getUser().getId();
        String userAvatar = userImagesRepository.findAvatarByUserId(userId).getImageUrl();

        ProvinceResponseDTO provinceResponseDTO = new ProvinceResponseDTO(finishBooking.getProvince().getCode(), finishBooking.getProvince().getName());
        DistrictResponseDTO districtResponseDTO = new DistrictResponseDTO(finishBooking.getDistrict().getCode(), finishBooking.getDistrict().getName());
        WardResponseDTO wardResponseDTO = new WardResponseDTO(finishBooking.getWard().getCode(), finishBooking.getWard().getName());
        BookingInfoResponse.BookingInfoResponseBuilder responseBuilder = BookingInfoResponse.builder();
        if (finishBooking.getDriver() != null) {
            ProvinceResponseDTO driverProvince = new ProvinceResponseDTO(finishBooking.getDriver().getProvince().getCode(), finishBooking.getDriver().getProvince().getName());
            DistrictResponseDTO driverDistrict = new DistrictResponseDTO(finishBooking.getDriver().getDistrict().getCode(), finishBooking.getDriver().getDistrict().getName());
            WardResponseDTO driverWard = new WardResponseDTO(finishBooking.getDriver().getWard().getCode(), finishBooking.getDriver().getWard().getName());
            System.out.println(driverWard);
            responseBuilder.driverName(finishBooking.getDriver().getName())
                    .driverPhone(finishBooking.getDriver().getPhone())
                    .driverEmail(finishBooking.getDriver().getEmail())
                    .driverNationalId(finishBooking.getDriver().getNationalId())
                    .driverDob(finishBooking.getDriver().getDob())
                    .driverLateFee(finishBooking.getDriver().getLateFee())
                    .driveLicense(listDriverLicense)
                    .driverId(finishBooking.getDriver().getId())
                    .driverPrice(finishBooking.getDriver().getPrice())
                    .driverProvince(driverProvince)
                    .driverDistrict(driverDistrict)
                    .driverWard(driverWard)
                    .driverAddressDetail(finishBooking.getDriver().getAddressDetail());

        }
        return responseBuilder
                .carName(finishBooking.getCar().getName())
                .carImg(allOfImgCar)
                .bookingId(finishBooking.getId())
                .name(finishBooking.getDriverName())
                .phone(finishBooking.getDriverPhone())
                .email(finishBooking.getDriverEmail())
                .nationalId(finishBooking.getDriverNationalId())
                .dob(finishBooking.getDriverDob())
                .from(convertToLocalDate(finishBooking.getStartDate()))
                .to(convertToLocalDate(finishBooking.getEndDate()))
                .numberOfDays(noOfDays)
                .price(finishBooking.getBasePrice())
                .driverStatus(finishBooking.getDriverStatus())
                .totalPrice(totalPrice)
                .deposit(finishBooking.getDeposit())
                .carId(finishBooking.getCar().getId())
                .province(provinceResponseDTO)
                .district(districtResponseDTO)
                .ward(wardResponseDTO)
                .addressDetail(finishBooking.getAddressDetail())
                .frontImg(finishBooking.getDriverLicenseFront())
                .backImg(finishBooking.getDriverLicenseBack())
                .status(finishBooking.getStatus())
                .discount(finishBooking.getDiscount())
                .carOwnerStatus(finishBooking.getCarOwnerStatus())
                .cancelBookingStatus((finishBooking.getCancelBooking() != null) ? finishBooking.getCancelBooking().getStatus() : null)
                .userId(userId)
                .userAvatar((userAvatar != null) ? userAvatar : null)
                .build();
    }

    public DriverBooking findByBookingAndDriver(int bookingId, int driverId) throws ApiException {
        DriverBooking driverBooking = driverBookingRepository.findByBookingAndDriver(bookingId, driverId);
        if (driverBooking == null) {
            throw new ApiException(400, "Driver booking does not exist");
        }
        return driverBooking;
    }

    private void sendOldDriverMail(User oldDriver) throws ApiException {
        emailService.sendEmail(oldDriver.getEmail(), "User has changed driver",
                "<h1>Too late! Your booking has been changed by user</h1>" +
                        "<p>Next time try accept sooner</p>" +
                        "<p>Thank you!</p>" +
                        "<a>Click here<a>");
    }
}
