package com.pjb2.rental_car.service.impl;

import com.pjb2.rental_car.dto.request.CarDraftEditRequest;
import com.pjb2.rental_car.dto.request.CarOwnerVoucherEditRequest;
import com.pjb2.rental_car.dto.request.CarOwnerVoucherRequest;
import com.pjb2.rental_car.dto.response.*;
import com.pjb2.rental_car.entity.*;
import com.pjb2.rental_car.exception.ApiException;
import com.pjb2.rental_car.repository.*;
import com.pjb2.rental_car.service.CarOwnerService;
import com.pjb2.rental_car.util.JwtService;
import com.pjb2.rental_car.util.Util;
import com.pjb2.rental_car.util.common.*;
import com.zaxxer.hikari.HikariDataSource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static java.util.Comparator.comparing;

@Service
@Slf4j
@RequiredArgsConstructor
public class CarOwnerServiceImpl implements CarOwnerService {
    private final UserRepository userRepository;
    private final CarRepository carRepository;
    private final CarImagesRepository carImagesRepository;
    private final UserImagesRepository userImagesRepository;
    private final CarServiceImpl carServiceImp;
    private final BookingRepository bookingRepository;
    private final JwtService jwtService;
    private final FeedbackRepository feedbackRepository;
    private final CarDraftRepository carDraftRepository;
    private final ProvinceRepository provinceRepository;
    private final DistrictRepository districtRepository;
    private final WardRepository wardRepository;
    private final CarFunctionRepository carFunctionRepository;
    private final CarFunctionInfoRepository carFunctionInfoRepository;
    private final CarTermOfUseRepository carTermOfUseRepository;
    private final VoucherRepository voucherRepository;
    private final HikariDataSource hikariDataSource;
    private final WalletHistoryRepository walletHistoryRepository;
    private final Util util;

    public Page<Map<String,Object>> getCarListByOwnerId(int ownerId,int page) throws ApiException {
        int size = 4;
        int adjustedPage = Math.max(page - 1, 0);
        Pageable pageable = PageRequest.of(adjustedPage, size, Sort.by("createdAt").descending());
        Page<Car> carPage = carRepository.findCarsByOwnerId(ownerId, pageable);
//        if (carPage.isEmpty()) {
//            throw new ApiException(HttpStatus.NOT_FOUND.value(), "No car found for this owner.");
//        }

        return carPage.map( car ->{

        String imageUrl = car.getCarImages() != null && !car.getCarImages().isEmpty()
                ? car.getCarImages().stream()
                .filter(carImage -> carImage.getType().equals(CarImageType.CAR_IMAGE))
                .map(carImages -> carImages.getImageUrl()).findFirst()
                .orElse("default-car-image.jpg")
                : "default-car-image.jpg";

                    Object[] stats = carRepository.getCarStats(car.getId(), BookingStatus.COMPLETED);
                    double averageRating = 0.0;
                int numberOfBookings = 0;

                    if (stats != null && stats.length > 0 && stats[0] instanceof Object[]) {
                        Object[] row = (Object[]) stats[0];
                        averageRating = row[0] != null ? ((Number) row[0]).doubleValue() : 0.0;
                        numberOfBookings = row[1] != null ? ((Number) row[1]).intValue() : 0;
                    }

                    LocalDateTime now = LocalDateTime.now();
                    Booking nearestBooking = bookingRepository.checkNearestBooking(
                            car.getId(),
                            Date.from(now.atZone(ZoneId.systemDefault()).toInstant()),
                            Date.from(now.atZone(ZoneId.systemDefault()).toInstant())
                    );

                    String carStatus = (nearestBooking != null) ? "BOOKED" : car.getStatus().name();



                    Map<String, Object> info = new HashMap<>();
            info.put("carId", car.getId());
            info.put("carName", car.getName());
            info.put("transmissionType", car.getTransmissionType());
            info.put("noOfSeats", car.getNoOfSeats());
            info.put("fuelType", car.getFuelType());
            info.put("location",
                    (car.getDistrict() != null ? car.getDistrict().getName() + ", " : "") +
                            (car.getProvince() != null ? car.getProvince().getName() : "")
            );
            info.put("carStatus", carStatus);
            info.put("basePrice", car.getBasePrice());
            info.put("rating", averageRating);
            info.put("numberOfBooking", numberOfBookings);
            info.put("carImages", imageUrl);
            return info;
        }
        );
    }

    public Page<Map<String, Object>> getFeedbackForOwnerCars(int ownerId, int page) throws ApiException {
        int size = 3;
        int adjustedPage = Math.max(page - 1, 0);
        Pageable pageable = PageRequest.of(adjustedPage, size, Sort.by("createdAt").descending());

        List<Integer> carIds = carRepository.findCarIdsByOwnerId(ownerId);
//        if (carIds.isEmpty()) {
//            throw new ApiException(HttpStatus.NOT_FOUND.value(), "No feedback found for this owner.");
//        }

        Page<Feedback> feedbackPage = feedbackRepository.findByCarIdIn(carIds, pageable);

        return feedbackPage.map(feedback -> {
            Map<String, Object> data = new HashMap<>();

            User user = feedback.getUser();
            Car car = feedback.getCar();
            Booking booking = feedback.getBooking();


            String avatarUrl = Optional.ofNullable(userImagesRepository.findAvatarByUserId(user.getId()))
                    .map(UserImages::getImageUrl)
                    .orElse("default-avatar.jpg");

            String carImageUrl = car.getCarImages() != null && !car.getCarImages().isEmpty()
                    ? car.getCarImages().stream()
                    .filter(img -> img.getType() == CarImageType.CAR_IMAGE)
                    .map(CarImages::getImageUrl)
                    .findFirst()
                    .orElse("default-car-image.jpg")
                    : "default-car-image.jpg";

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
            String createdAt = feedback.getCreatedAt().format(formatter);

            String pickupDate = booking.getStartDate() != null
                    ? new SimpleDateFormat("dd/MM/yyyy").format(booking.getStartDate())
                    : "";
            String dropoffDate = booking.getEndDate() != null
                    ? new SimpleDateFormat("dd/MM/yyyy").format(booking.getEndDate())
                    : "";

            data.put("feedbackId", feedback.getId());
            data.put("userId", user.getId());
            data.put("userName", user.getName());
            data.put("avatarUrl", avatarUrl);
            data.put("createdAt", createdAt);
            data.put("carName", car.getName());
            data.put("carImageUrl",carImageUrl);
            data.put("from", pickupDate);
            data.put("to", dropoffDate);
            data.put("comment", feedback.getComment());
            data.put("rating", feedback.getRating());

            return data;
        });
    }


    public List<CarBrandResponse> getBrandByOwnerId(int ownerId) throws ApiException {
        List<Car> cars = carRepository.findByUserId(ownerId);

//        if (cars.isEmpty()) {
//            throw new ApiException(HttpStatus.NOT_FOUND.value(), "No cars found for this owner.");
//        }

        return cars.stream()
                .map(car -> car.getCarModel().getBrand())
                .distinct()
                .map(brand -> new CarBrandResponse(brand.getId(), brand.getName()))
                .collect(Collectors.toList());
    }


    @Override
    public CarOwnerDetailResponse getCarOwnerDetail(int carOwnerId, int carPage, int feedbackPage) throws ApiException {
        User owner = userRepository.findById(carOwnerId)
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST.value(), "Car owner not found!"));

        boolean isCarOwner = owner.getRoles().stream()
                .anyMatch(role -> "carOwner".equals(role.getName()));

        if (!isCarOwner) {
            throw new ApiException(HttpStatus.FORBIDDEN.value(), "This user is not carOwner!");
        }

        String avatarUrl = Optional.ofNullable(userImagesRepository.findAvatarByUserId(owner.getId()))
                .map(UserImages::getImageUrl)
                .orElse("default-avatar.jpg");

        int totalFeedback = feedbackRepository.countFeedbackByCarOwnerId(carOwnerId);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String joinedAt = owner.getCreatedAt().format(formatter);

        Page<Map<String, Object>> carPageResult = getCarListByOwnerId(carOwnerId, carPage);
        if (carPageResult == null || carPageResult.isEmpty()) {
            carPageResult = Page.empty();
        }
        Map<String, Object> carList = new LinkedHashMap<>();
        carList.put("currentPage", carPageResult.getNumber() + 1);
        carList.put("totalPages", carPageResult.getTotalPages());
        carList.put("pageSize", carPageResult.getSize());
        carList.put("cars", carPageResult.getContent());

        Page<Map<String, Object>> feedbackPageResult = getFeedbackForOwnerCars(carOwnerId, feedbackPage);
        if (feedbackPageResult == null || feedbackPageResult.isEmpty()) {
            feedbackPageResult = Page.empty();
        }
        Map<String, Object> feedbackList = new LinkedHashMap<>();
        feedbackList.put("totalFeedback", totalFeedback);
        feedbackList.put("currentPage", feedbackPageResult.getNumber() + 1);
        feedbackList.put("totalPages", feedbackPageResult.getTotalPages());
        feedbackList.put("pageSize", feedbackPageResult.getSize());
        feedbackList.put("feedbacks", feedbackPageResult.getContent());

        Long bookingCount = bookingRepository.countBookingsByOwnerAndStatus(carOwnerId, BookingStatus.COMPLETED);
        Double avgRating = feedbackRepository.getAverageRatingByOwnerId(carOwnerId);

        int totalBookings = bookingCount != null ? bookingCount.intValue() : 0;
        double averageRating = avgRating != null ? avgRating : 0.0;




        return new CarOwnerDetailResponse(
                carOwnerId,
                owner.getName(),
                owner.getPhone(),
                owner.getEmail(),
                (owner.getProvince() != null ? owner.getProvince().getName() + ", " : "") +
                        (owner.getDistrict() != null ? owner.getDistrict().getName() : ""),
                owner.getDescription() != null ? owner.getDescription() : "No description",
                avatarUrl,
                carList,
                getBrandByOwnerId(carOwnerId),
                feedbackList,
                joinedAt,
                totalBookings,
                averageRating,
                carPage,
                feedbackPage,
                totalFeedback

        );
    }


    @Override
    public FeedbackReportPageResponse getListFeedbackReport(String token, String sort, int page, int size, int starRating) throws ApiException {
        //Sorting
        Sort.Order order = new Sort.Order(Sort.Direction.ASC, "created_at");
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
        if (page > 0) {
            pageNo = page - 1;
        }
        //Paging
        Pageable pageable = PageRequest.of(pageNo, size, Sort.by(order));
        return listFeedbackReportResponse(token, pageable,starRating);
    }
    @Transactional(rollbackFor = ApiException.class)
    @Override
    public void editCarDraft(String token, int draftId, List<MultipartFile> registration, List<MultipartFile> certificate, List<MultipartFile> insurance, List<MultipartFile> lists,CarDraftEditRequest req) throws ApiException {
        String email = jwtService.getEmailFromToken(token);
        User carOwner = userRepository.findByEmail(email);
        CarDraft carDraft = carDraftRepository.findCarDraftById(draftId);
        if(carDraft.getUser() != null && carDraft.getUser() != carOwner) { throw new ApiException(HttpStatus.UNAUTHORIZED.value(), "Car owner not found!, You can not edit this car draft."); }
        if (req != null) {
            //--
            if(util.isLicencePlateExisted(req.getLicencePlate())) {
                throw new ApiException(HttpStatus.CONFLICT.value(), "Licence plate already existed");
            }
            carDraft.setLicencePlate(req.getLicencePlate());
            CarModel carModel = carServiceImp.getCarModelById(req.getCarModelId());
            String carName = carModel.getBrand().getName() + " " + carModel.getName();
            carDraft.setName(carName);
            carDraft.setCarModel(carModel);
            carDraft.setColor(req.getColor());
            carDraft.setProductionYear(req.getProductionYear());
            carDraft.setNoOfSeats(req.getNoOfSeats());
            carDraft.setTransmissionType(TransmissionType.valueOf(req.getTransmissionType().toUpperCase()));
            carDraft.setFuelType(FuelType.valueOf(req.getFuelType().toUpperCase()));
            carDraft.setCarType(carServiceImp.getCarTypeById(req.getCarTypeId()));
            if (!registration.isEmpty()) {
                //manage paper-----------
                List<CarImages> oldRegister = carImagesRepository.findRegistrationImagesByDraftId(draftId);
                List<String> imgUrl = carServiceImp.getImagesUrl(oldRegister);
                for (String url : imgUrl) {
                    carServiceImp.deleteFileByUrl(url);
                }
                carImagesRepository.deleteAll(oldRegister);
                if (carServiceImp.validateFiles(registration, true)) {
                    // Upload and save registration images
                    carServiceImp.saveCarImagesToDraft(registration, draftId, CarImageType.REGISTRATION_IMAGE);
                }

            }
            if (!certificate.isEmpty()) {
                List<CarImages> oldCertificate = carImagesRepository.findCertificateImagesByDraftId(draftId);
                List<String> imgUrl = carServiceImp.getImagesUrl(oldCertificate);
                for (String url : imgUrl) {
                    carServiceImp.deleteFileByUrl(url);
                }
                carImagesRepository.deleteAll(oldCertificate);
                if (carServiceImp.validateFiles(certificate, true)) {
                    // Upload and save certificate images
                    carServiceImp.saveCarImagesToDraft(certificate, draftId, CarImageType.CERTIFICATE_IMAGE);
                }

            }
            if (!insurance.isEmpty()) {
                List<CarImages> oldInsurance = carImagesRepository.findInsuranceImagesByDraftId(draftId);
                List<String> imgUrl = carServiceImp.getImagesUrl(oldInsurance);
                for (String url : imgUrl) {
                    carServiceImp.deleteFileByUrl(url);
                }
                carImagesRepository.deleteAll(oldInsurance);
                if (carServiceImp.validateFiles(insurance, true)) {
                    // Upload and save insurance images
                    carServiceImp.saveCarImagesToDraft(insurance, draftId, CarImageType.INSURANCE_IMAGE);
                }

            }
            carDraft.setMileage(req.getMileage());
            carDraft.setFuelConsumption(req.getFuelConsumption());
            carDraft.setProvince(provinceRepository.findById(req.getProvinceCode()).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "Province not found")));
            carDraft.setDistrict(districtRepository.findById(req.getDistrictCode()).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "District not found")));
            carDraft.setWard(wardRepository.findById(req.getWardCode()).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "Ward not found")));
            carDraft.setAddressDetail(req.getAddressDetails());
            carDraft.setDescription(req.getDescription());
            List<CarFunction> carDeleteFunctions = carFunctionRepository.findByCarDraft(carDraft);
            carFunctionRepository.deleteAll(carDeleteFunctions);
            List<Integer> funtions = req.getCarFunctionsId();
            List<CarFunction> carFunctions = new ArrayList<>();
            for (int funtionId : funtions) {
                carFunctions.add(new CarFunction(carFunctionInfoRepository.GetByFuncId(funtionId), carDraft));
            }
            carFunctionRepository.saveAll(carFunctions);
            //-----------------
            if (!lists.isEmpty()) {
                List<CarImages> oldCarImages = carImagesRepository.findCarImagesByDraftId(draftId);
                List<String> imgUrl = carServiceImp.getImagesUrl(oldCarImages);
                for (String url : imgUrl) {
                    carServiceImp.deleteFileByUrl(url);
                }
                carImagesRepository.deleteAll(oldCarImages);
                if (carServiceImp.validateFiles(lists, true)) {
                    // Upload and save registration images
                    carServiceImp.saveCarImagesToDraft(lists, draftId, CarImageType.CAR_IMAGE);
                }
            }
            carDraft.setBasePrice(req.getBasePrice());
            carDraft.setDeposit(req.getDeposit());
            List<CarTermOfUse> oldTerms = carTermOfUseRepository.findByCarDraft(carDraft);
            carTermOfUseRepository.deleteAll(oldTerms);
            List<String> terms = req.getCarTermOfUse();
            if (!terms.isEmpty()) {
                List<CarTermOfUse> termOfUses = new ArrayList<>();
                for (String term : terms) {
                    termOfUses.add(new CarTermOfUse(term, carDraft, TermOfUseType.GENERAL));
                }
                carTermOfUseRepository.saveAll(termOfUses);
            }
            carTermOfUseRepository.save(new CarTermOfUse(carDraft, TermOfUseType.LATE_FEE, req.getLateFee()));
            carDraft.setStatus(CarDraftStatus.PENDING);
            carDraft.setRejectMessage(null);
            carDraftRepository.save(carDraft);

        } else {
            throw new ApiException(HttpStatus.NO_CONTENT.value(), "Missing required fields");
        }
    }



    private FeedbackReportPageResponse listFeedbackReportResponse(String token, Pageable pageable, int starRating) throws ApiException {
        String email = jwtService.getEmailFromToken(token);
        User carOwner = userRepository.findByEmail(email);
        Page<Feedback> listFeedBack = feedbackRepository.getAllFeedbackByCarOwner(carOwner.getId(),starRating,pageable);
        List<FeedbackReportResponse> feedbackResponses = listFeedBack.getContent().stream().map(feedback -> FeedbackReportResponse.builder()
                .carImg(carImagesRepository.findCarImagesByCarId(feedback.getCar().getId()).get(0).getImageUrl())
                .carName(feedback.getCar().getName())
                .startBookingDate(feedback.getBooking() == null ? null : feedback.getBooking().getStartDate())
                .endBookingDate(feedback.getBooking() == null ? null : feedback.getBooking().getEndDate())
                .comment(feedback.getComment())
                .rating(feedback.getRating())
                .userName(feedback.getUser().getName())
                .userImg(feedback.getUser().getUserImages().stream()
                        .filter(img -> img.getType() == UserImageType.AVATAR)
                        .findFirst()
                        .map(UserImages::getImageUrl)
                        .orElse(null))
                .dateOfRating(feedback.getCreatedAt())
                .build()).toList();
        FeedbackReportPageResponse response = new FeedbackReportPageResponse();
        response.setPageNumber(listFeedBack.getNumber() + 1);
        response.setPageSize(pageable.getPageSize());
        response.setTotalElements(listFeedBack.getNumberOfElements());
        response.setTotalPages(listFeedBack.getTotalPages());
        response.setListCarFeedback(feedbackResponses);
        response.setNumberOfRatings(feedbackRepository.getAllFeedbackByCarOwner(carOwner.getId(), 0).size());
        response.setAverageRating(carServiceImp.getAverageRating(feedbackRepository.getAllFeedbackByCarOwner(carOwner.getId(), 0)));
        response.setNumberOf1starRatings(feedbackRepository.getAllFeedbackByCarOwner(carOwner.getId(), 1).size());
        response.setNumberOf2starRatings(feedbackRepository.getAllFeedbackByCarOwner(carOwner.getId(), 2).size());
        response.setNumberOf3starRatings(feedbackRepository.getAllFeedbackByCarOwner(carOwner.getId(), 3).size());
        response.setNumberOf4starRatings(feedbackRepository.getAllFeedbackByCarOwner(carOwner.getId(), 4).size());
        response.setNumberOf5starRatings(feedbackRepository.getAllFeedbackByCarOwner(carOwner.getId(), 5).size());
        return response;
    }

    @Override
    public MyCarDraftPageResponse getListCarDraft(String token, String sort, int page, int size) throws ApiException{
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
        if (page > 0) {
            pageNo = page - 1;
        }
        //Paging
        Pageable pageable = PageRequest.of(pageNo, size, Sort.by(order));


        return getMyCarDraftResponse(token, pageable);
    }

    public MyCarDraftPageResponse getMyCarDraftResponse(String token,Pageable pageable) throws ApiException {
        String email = jwtService.getEmailFromToken(token);
        User carOwner = userRepository.findByEmail(email);
        Page<CarDraft> listCarDraft= carDraftRepository.findAllCarDraftRequestByUserId(carOwner.getId(),pageable);
        List<MyCarDraftResponse> myCarDraftResponses = listCarDraft.getContent().stream().map(carDraft -> MyCarDraftResponse.builder()
                .draftId(carDraft.getId())
                .carImagesUrl(carServiceImp.getImagesUrl(carImagesRepository.findCarImagesByDraftId(carDraft.getId())))
                .brand(carDraft.getCarModel().getBrand().getName())
                .model(carDraft.getCarModel().getName())
                .rating(0.0)
                .noOfRides(0)
                .basePrice(carDraft.getBasePrice())
                .province(carDraft.getProvince().getName())
                .district(carDraft.getDistrict().getName())
                .status(carDraft.getStatus().toString())
                .type(carDraft.getType().toString())
                .build()).toList();

        MyCarDraftPageResponse response = new MyCarDraftPageResponse();
        response.setPageNumber(listCarDraft.getNumber() + 1);
        response.setPageSize(pageable.getPageSize());
        response.setTotalElements(listCarDraft.getNumberOfElements());
        response.setTotalPages(listCarDraft.getTotalPages());
        response.setListCarDraftResponse(myCarDraftResponses);
        return response;
    }
    @Transactional(rollbackFor = ApiException.class)
    @Override
    public void editCarInformation(String token ,int carId, List<MultipartFile> files,List<MultipartFile> registration,List<MultipartFile> certificate,List<MultipartFile> insurance ,CarDraftEditRequest request) throws ApiException,IOException {
        Car car = carServiceImp.getCarById(carId);
        String email = jwtService.getEmailFromToken(token);
        User carOwner = userRepository.findByEmail(email);
        if(carOwner!= car.getUser()){ throw new ApiException(HttpStatus.UNAUTHORIZED.value(), "You are not allowed to edit this car"); }
        if(car.isDeleted()) throw new ApiException(HttpStatus.BAD_GATEWAY.value(), "This car is deleted or in a pending of editing!");
        car.setDeleted(true);
        carRepository.save(car);
        CarDraft carDraft = new CarDraft();
        carDraft.setType(CarDraftType.UPDATE);
        carDraft.setCar(car);
        carDraft.setUser(carOwner);
        CarDraft saveDraft = carDraftRepository.save(carDraft);

        if (request != null) {
            //--
            String requestLicensePlate = request.getLicencePlate();
            if(!requestLicensePlate.equalsIgnoreCase(car.getLicencePlate()) && util.isLicencePlateExisted(request.getLicencePlate())) {
                throw new ApiException(HttpStatus.CONFLICT.value(), "Licence plate already existed");
            }
            carDraft.setLicencePlate(request.getLicencePlate());
            CarModel carModel = carServiceImp.getCarModelById(request.getCarModelId());
            String carName = carModel.getBrand().getName() + " " + carModel.getName();
            carDraft.setName(carName);
            carDraft.setCarModel(carModel);
            carDraft.setColor(request.getColor());
            carDraft.setProductionYear(request.getProductionYear());
            carDraft.setNoOfSeats(request.getNoOfSeats());
            carDraft.setTransmissionType(TransmissionType.valueOf(request.getTransmissionType().toUpperCase()));
            carDraft.setFuelType(FuelType.valueOf(request.getFuelType().toUpperCase()));
            carDraft.setCarType(carServiceImp.getCarTypeById(request.getCarTypeId()));
            carDraft.setMileage(request.getMileage());
            carDraft.setFuelConsumption(request.getFuelConsumption());
            carDraft.setProvince(provinceRepository.findById(request.getProvinceCode()).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "Province not found")));
            carDraft.setDistrict(districtRepository.findById(request.getDistrictCode()).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "District not found")));
            carDraft.setWard(wardRepository.findById(request.getWardCode()).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "Ward not found")));
            carDraft.setAddressDetail(request.getAddressDetails());
            carDraft.setDescription(request.getDescription());
            carDraft.setBasePrice(request.getBasePrice());
            carDraft.setDeposit(request.getDeposit());
            carDraft.setStatus(CarDraftStatus.PENDING);
            carDraft.setRejectMessage(null);
            carDraftRepository.save(carDraft);
            if (!registration.isEmpty()) {
                //manage paper-----------
                List<CarImages> oldRegister = carImagesRepository.findRegistrationImagesByDraftId(saveDraft.getId());
                List<String> imgUrl = carServiceImp.getImagesUrl(oldRegister);
                for (String url : imgUrl) {
                    carServiceImp.deleteFileByUrl(url);
                }
                carImagesRepository.deleteAll(oldRegister);

                if (carServiceImp.validateFiles(registration, true)) {
                    // Upload and save registration images
                    carServiceImp.saveCarImagesToDraft(registration, saveDraft.getId(), CarImageType.REGISTRATION_IMAGE);
                }

            }else{
                List<CarImages> carOldRegistration = carImagesRepository.findRegistrationImagesByCarId(carId);
                List<String> carOldImgUrl = carOldRegistration.stream().map(CarImages::getImageUrl).toList();
                saveCarImagesToDraftWhileUpdate(carOldImgUrl, saveDraft.getId(), CarImageType.REGISTRATION_IMAGE);
            }
            if (!certificate.isEmpty()) {
                List<CarImages> oldCertificate = carImagesRepository.findCertificateImagesByDraftId(saveDraft.getId());
                List<String> imgUrl = carServiceImp.getImagesUrl(oldCertificate);
                for (String url : imgUrl) {
                    carServiceImp.deleteFileByUrl(url);
                }
                carImagesRepository.deleteAll(oldCertificate);
                if (carServiceImp.validateFiles(certificate, true)) {
                    // Upload and save certificate images
                    carServiceImp.saveCarImagesToDraft(certificate, saveDraft.getId(), CarImageType.CERTIFICATE_IMAGE);
                }

            }else{
                List<CarImages> carOldCertificate = carImagesRepository.findCertificateImagesByCarId(carId);
                List<String> carOldImgUrl = carOldCertificate.stream().map(CarImages::getImageUrl).toList();
                saveCarImagesToDraftWhileUpdate(carOldImgUrl, saveDraft.getId(), CarImageType.CERTIFICATE_IMAGE);
            }
            if (!insurance.isEmpty()) {
                List<CarImages> oldInsurance = carImagesRepository.findInsuranceImagesByDraftId(saveDraft.getId());
                List<String> imgUrl = carServiceImp.getImagesUrl(oldInsurance);
                for (String url : imgUrl) {
                    carServiceImp.deleteFileByUrl(url);
                }
                carImagesRepository.deleteAll(oldInsurance);
                if (carServiceImp.validateFiles(insurance, true)) {
                    // Upload and save insurance images
                    carServiceImp.saveCarImagesToDraft(insurance, saveDraft.getId(), CarImageType.INSURANCE_IMAGE);
                }

            }else{
                List<CarImages> carOldInsurance = carImagesRepository.findInsuranceImagesByCarId(carId);
                List<String> carOldImgUrl = carOldInsurance.stream().map(CarImages::getImageUrl).toList();
                saveCarImagesToDraftWhileUpdate(carOldImgUrl, saveDraft.getId(), CarImageType.INSURANCE_IMAGE);
            }

            List<CarFunction> carDeleteFunctions = carFunctionRepository.findByCarDraft(carDraft);
            carFunctionRepository.deleteAll(carDeleteFunctions);
            List<Integer> funtions = request.getCarFunctionsId();
            List<CarFunction> carFunctions = new ArrayList<>();
            for (int funtionId : funtions) {
                carFunctions.add(new CarFunction(carFunctionInfoRepository.GetByFuncId(funtionId), carDraft));
            }
            carFunctionRepository.saveAll(carFunctions);
            //-----------------
            if (!files.isEmpty()) {
                List<CarImages> oldCarImages = carImagesRepository.findCarImagesByDraftId(saveDraft.getId());
                List<String> imgUrl = carServiceImp.getImagesUrl(oldCarImages);
                for (String url : imgUrl) {
                    carServiceImp.deleteFileByUrl(url);
                }
                carImagesRepository.deleteAll(oldCarImages);
                    // Upload and save registration images
                    carServiceImp.saveCarImagesToDraft(files, saveDraft.getId(), CarImageType.CAR_IMAGE);

            }else{
                List<CarImages> carOldImg = carImagesRepository.findCarImagesByCarId(carId);
                List<String> carOldImgUrl = carOldImg.stream().map(CarImages::getImageUrl).toList();
                saveCarImagesToDraftWhileUpdate(carOldImgUrl, saveDraft.getId(), CarImageType.CAR_IMAGE);
            }

            List<CarTermOfUse> oldTerms = carTermOfUseRepository.findByCarDraft(carDraft);
            carTermOfUseRepository.deleteAll(oldTerms);
            List<String> terms = request.getCarTermOfUse();
            if (!terms.isEmpty()) {
                List<CarTermOfUse> termOfUses = new ArrayList<>();
                for (String term : terms) {
                    termOfUses.add(new CarTermOfUse(term, carDraft, TermOfUseType.GENERAL));
                }
                carTermOfUseRepository.saveAll(termOfUses);
            }
            carTermOfUseRepository.save(new CarTermOfUse(carDraft, TermOfUseType.LATE_FEE, request.getLateFee()));
        } else {
            throw new ApiException(HttpStatus.NO_CONTENT.value(), "Missing required fields");
        }
    }
    @Transactional(rollbackFor = Exception.class)
    @Override
    public void deleteUpdateCarDraft(String token, int draftId) throws ApiException {
        String email = jwtService.getEmailFromToken(token);
        User carOwner = userRepository.findByEmail(email);
        CarDraft carDraft = carServiceImp.getCarDraftById(draftId);
        if(carDraft.getUser() != carOwner) { throw new ApiException(HttpStatus.UNAUTHORIZED.value(), "Car owner not found!, You can not edit this car draft."); }
        if(carDraft.getStatus().equals(CarDraftStatus.ALLOW)) {
            throw new ApiException(HttpStatus.UNAUTHORIZED.value(), "Admin has accept this draft request!");
        }else {
            carDraft.setIsDeleted(true);
            carDraft.setStatus(CarDraftStatus.CANCELLED);
            carDraftRepository.save(carDraft);
            Car car = carDraft.getCar();
            car.setDeleted(false);
            carRepository.save(car);
        }
    }
    @Transactional(rollbackFor = ApiException.class)
    @Override
    public void createVoucherByCarOwner(String token, CarOwnerVoucherRequest request) throws ApiException {
        String email = jwtService.getEmailFromToken(token);
        User carOwner = userRepository.findByEmail(email);
        Voucher voucher = new Voucher();
        voucher.setType(VoucherType.CAR_OWNER_VOUCHER);
        voucher.setUser(carOwner);
        voucher.setScope(VoucherScope.valueOf(request.getScope().toUpperCase()));
        voucher.setName(request.getName());
        voucher.setDescription(request.getDescription());
        List<Car> listCar = carRepository.findByIdIn(request.getListCarId());
        voucher.setCars(listCar);
        voucher.setStartDate(request.getStartDate());
        voucher.setEndDate(request.getEndDate());
        voucher.setQuantity(request.getQuantity());
        voucher.setPercentRate(request.getPercentRate());
        voucher.setMaxPrice(request.getMaxPrice());
        voucher.setFixedPrice(request.getFixedPrice());
        if(util.isVoucherCodeExisted(request.getCode())) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY.value(), "Voucher code already exists!");
        }
        voucher.setCode(request.getCode());
        voucher.setStatus(VoucherStatus.INACTIVE);
        voucherRepository.save(voucher);
    }
    @Transactional(rollbackFor = ApiException.class)
    @Override
    public void editVoucherByCarOwner(String token, int voucherId, CarOwnerVoucherEditRequest request) throws ApiException {
        String email = jwtService.getEmailFromToken(token);
        User carOwner = userRepository.findByEmail(email);
        Voucher editVoucher = findVoucherById(voucherId);
        if(editVoucher.getUser() != carOwner) {
            throw new ApiException(HttpStatus.UNAUTHORIZED.value(), "Car owner not found! You are not allowed to edit this voucher");
        }
        editVoucher.setName(request.getName());
        editVoucher.setDescription(request.getDescription());
        editVoucher.setScope(VoucherScope.valueOf(request.getScope().toUpperCase()));
        List<Car> listCar = carRepository.findByIdIn(request.getListCarId());
        editVoucher.setCars(listCar);
        editVoucher.setStartDate(request.getStartDate());
        editVoucher.setEndDate(request.getEndDate());
        editVoucher.setQuantity(request.getQuantity());
        editVoucher.setPercentRate(request.getPercentRate());
        editVoucher.setMaxPrice(request.getMaxPrice());
        editVoucher.setFixedPrice(request.getFixedPrice());
        if(!editVoucher.getCode().equalsIgnoreCase(request.getCode())&& util.isVoucherCodeExisted(request.getCode())) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY.value(), "Voucher code already exists!");
        }
        editVoucher.setCode(request.getCode());
        editVoucher.setStatus(VoucherStatus.INACTIVE);
        voucherRepository.save(editVoucher);
    }

    @Override
    public CarOwnerDashboardResponse getCarOwnerDashboard(String token, Date startWeekDate, Date endWeekDate, Date startMonthDate, Date endMonthdate) throws ApiException {
        String email = jwtService.getEmailFromToken(token);
        User carOwner = userRepository.findByEmail(email);
        List<Car> listCarOfOwner = carRepository.getCarByUserId(carOwner.getId());
        int numberOfCar = listCarOfOwner.size();
        int numberOfAvailableCar = listCarOfOwner.stream().filter(car -> car.getStatus().equals(CarStatus.AVAILABLE)  || car.getStatus().equals(CarStatus.BOOKED) ).toList().size();
        int numberOfStoppedCar = listCarOfOwner.stream().filter(car -> car.getStatus().equals(CarStatus.STOPPED)).toList().size();

        List<Booking> listBookingOfCarOwner = bookingRepository.findBookingByCarOwnerId(carOwner.getId());

        int numberOfBookingInWeek = listBookingOfCarOwner.stream()
                .filter(booking -> !booking.getStartDate().before(startWeekDate)&& !booking.getStartDate().after(endWeekDate))
                .toList()
                .size();
        int numberOfBookingInMonth = listBookingOfCarOwner.stream()
                .filter(booking -> !booking.getStartDate().before(startMonthDate)&& !booking.getStartDate().after(endMonthdate))
                .toList()
                .size();




        List<Double> listWeeklyBalance = walletHistoryRepository.findWalletHistoryByTypeAndDateRange(carOwner.getWallet().getId(),WalletHistoryType.RENTED,startWeekDate,endWeekDate).stream().map(WalletHistory::getAmount).toList();
        List<Double> listLastWeeklyBalance = walletHistoryRepository.findWalletHistoryOfLastWeek(carOwner.getWallet().getId(),WalletHistoryType.RENTED,startWeekDate,endWeekDate).stream().map(WalletHistory::getAmount).toList();
        double thisWeekIncome = listWeeklyBalance.stream().mapToDouble(d->d).sum();
        double lastWeekIncome = listLastWeeklyBalance.stream().mapToDouble(d->d).sum();
        IncomeDTO incomeInWeek = IncomeDTO.builder()
                .balance(thisWeekIncome)
                .changePercentage(incomePercentageChanges(lastWeekIncome, thisWeekIncome))
                .build();

        List<Double> listMonthlyBalance = walletHistoryRepository.findWalletHistoryByTypeAndDateRange(carOwner.getWallet().getId(),WalletHistoryType.RENTED,startMonthDate,endMonthdate).stream().map(WalletHistory::getAmount).toList();
        List<Double> listLastMonthlyBalance = walletHistoryRepository.findWalletHistoryOfLastMonth(carOwner.getWallet().getId(),WalletHistoryType.RENTED,startMonthDate,endMonthdate).stream().map(WalletHistory::getAmount).toList();
        double thisMonthIncome = listMonthlyBalance.stream().mapToDouble(d->d).sum();
        double lastMonthIncome = listLastMonthlyBalance.stream().mapToDouble(d->d).sum();
        IncomeDTO incomeInMonth = IncomeDTO.builder()
                .balance(thisMonthIncome)
                .changePercentage(incomePercentageChanges(lastMonthIncome, thisMonthIncome))
                .build();

        List<WalletHistory> userWalletHistory = carOwner.getWallet().getHistory();
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

        List<ChartResponse> barChartRespons = walletHistoryRepository.findByDataForIncomeBarCharByMonth(carOwner.getWallet().getId());


        return CarOwnerDashboardResponse.builder()
                .numberOfCar(numberOfCar)
                .numberOfAvailableCar(numberOfAvailableCar)
                .numberOfStoppedCar(numberOfStoppedCar)
                .numberOfBookingInWeek(numberOfBookingInWeek)
                .numberOfBookingInMonth(numberOfBookingInMonth)
                .incomeInWeek(incomeInWeek)
                .incomeInMonth(incomeInMonth)
                .listOfBookings(listBookings)
                .barChartIncomeByMonth(barChartRespons)
                .build();
    }

    public void saveCarImagesToDraftWhileUpdate (List<String> urls,int draftId, CarImageType carImageType) throws ApiException {
        for (String url : urls) {
            System.out.println(url);
            CarImages imageData = CarImages.builder()
                    .imageUrl(url)
                    .carDraft(carDraftRepository.findCarDraftById(draftId))
                    .type(carImageType)
                    .build();
            carImagesRepository.save(imageData); // Lưu vào database
        }
    }

    public Voucher findVoucherById(int voucherId) throws ApiException {
        return voucherRepository.findById(voucherId).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "Voucher not found!"));
    }
    public double incomePercentageChanges(double lastIncome, double thisIncome) throws ApiException {
        double percentageChange;
        if (lastIncome == 0) {
            percentageChange = thisIncome == 0 ? 0 : 100;
        } else {
            percentageChange = ((thisIncome - lastIncome) / lastIncome) * 100;
        }
        return Math.round(percentageChange * 100.0) / 100.0;
    }

}
