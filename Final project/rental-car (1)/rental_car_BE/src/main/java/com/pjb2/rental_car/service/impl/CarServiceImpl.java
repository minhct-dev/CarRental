package com.pjb2.rental_car.service.impl;

import com.pjb2.rental_car.dto.request.*;
import com.pjb2.rental_car.dto.response.*;
import com.pjb2.rental_car.entity.*;
import com.pjb2.rental_car.exception.ApiException;

import com.pjb2.rental_car.repository.*;
import com.pjb2.rental_car.service.CarService;
import com.pjb2.rental_car.util.JwtService;
import com.pjb2.rental_car.util.Util;
import com.pjb2.rental_car.util.common.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class CarServiceImpl implements CarService {
    private final CarRepository carRepository;
    private final BookingRepository bookingRepository;
    private final CarImagesRepository carImagesRepository;
    private final CarDraftRepository carDraftRepository;
    private final CarModelRepository carModelRepository;
    private final CarBrandRepository carBrandRepository;
    public final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads";
    public final UserRepository userRepository;
    public final ProvinceRepository provinceRepository;
    public final DistrictRepository districtRepository;
    public final WardRepository wardRepository;
    public final CarTermOfUseRepository carTermOfUseRepository;
    public final JwtService jwtService;
    public final CarFunctionInfoRepository carFunctionInfoRepository;
    public final CarFunctionRepository carFunctionRepository;
    public final CarTypeRepository carTypeRepository;
    private final FeedbackRepository feedbackRepository;
    private final UserImagesRepository userImagesRepository;
    private final Util util;
    DateTimeFormatter isoFormatter = DateTimeFormatter.ISO_INSTANT;
    private final UserDraftRepository userDraftRepository;

    //Get car detail for UC09 View Car detail
    // maintain status : done
    // return booking date if exist : done
    @Override
    public CarDetailResponse getCarDetail(int id, String token, Date start_date, Date end_date, int feedbackPage) throws ApiException {
        Car car = findCarById(id);
        if (car.getStatus().equals(CarStatus.STOPPED)) {
            throw new ApiException(HttpStatus.NOT_FOUND.value(), "Car is not available");
        }
        List<Feedback> feedbacks = car.getFeedbacks();
        int noOfRides = findBookingByCarId(id).size();
        double averageRate = getAverageRating(feedbacks);
        List<Feedback> carOwnerListFeedback = feedbackRepository.getAllFeedbackByCarOwner(car.getUser().getId(),0);
        double averageOwnerRating = carOwnerListFeedback.stream().mapToDouble(Feedback::getRating).average().orElse(0.0);
        double roundedAverage = Math.round(averageOwnerRating * 10) / 10.0;
        List<String> carImages = getImagesUrl(carImagesRepository.findCarImagesByCarId(id));
        List<String> registrationImages = getImagesUrl(carImagesRepository.findRegistrationImagesByCarId(id));
        List<String> certificateImages = getImagesUrl(carImagesRepository.findCertificateImagesByCarId(id));
        List<String> insuranceImages = getImagesUrl(carImagesRepository.findInsuranceImagesByCarId(id));
        List<CarFunctionInfo> carFunctionInfos = car.getCarFunctions().stream().map(CarFunction::getCarFunctionInfo).toList();
        List<String> carTermOfUse = car.getCarTermOfUses().stream().map(CarTermOfUse::getTerm).toList();
        boolean book_checked;
        System.out.println(token);
        if (token == null || token.isEmpty()) {
            book_checked = false;
        } else {
            book_checked = isUserBookingCarChecked(token, id);
            System.out.println(book_checked);
        }
        String status = "Available";
        Booking booking = checkBookingCar(id, start_date, end_date);
        CarDetailResponse.CarDetailResponseBuilder responseBuilder = CarDetailResponse.builder();
        if (booking != null) {
            status = "Booked";
            responseBuilder
                    .book_start_date(isoFormatter.format(booking.getStartDate().toInstant()))
                    .book_end_date(isoFormatter.format(booking.getEndDate().toInstant()));
        }
        //return list feedback
        //Sorting
        Sort.Order order = new Sort.Order(Sort.Direction.DESC, "created_at");
        int pageNo = 0;
        if (feedbackPage > 0) {
            pageNo = feedbackPage - 1;
        }
        Pageable pageable = PageRequest.of(pageNo, 10, Sort.by(order));
        Page<Feedback> listFeedback = feedbackRepository.findFeedbackByCarId(id,pageable);

        List<CarFeedbackResponse> carFeedbackResponseList = listFeedback.stream().map(feedback -> CarFeedbackResponse
                .builder()
                .name(feedback.getUser().getName())
                .imageUrl(userImagesRepository.findAvatarByUserId(feedback.getUser().getId())!= null? userImagesRepository.findAvatarByUserId(feedback.getUser().getId()).getImageUrl() : null)
                .comment(feedback.getComment())
                .rating(feedback.getRating())
                .feedbackDate(feedback.getCreatedAt())
                .build()).toList();
        return responseBuilder
                .carId(id)
                .carImages(carImages)
                .name(car.getName())
                .rating(averageRate)
                .noOfRide(noOfRides)
                .province(car.getProvince().getName())
                .district(car.getDistrict().getName())
                .ward(car.getWard().getName())
                .addressDetail(car.getAddressDetail())
                .status(status)
                .licencePlate(car.getLicencePlate())
                .color(car.getColor())
                .brand(car.getCarModel().getBrand().getName())
                .model(car.getCarModel().getName())
                .productionYear(car.getProductionYear())
                .noOfSeats(car.getNoOfSeats())
                .transmissionType(car.getTransmissionType())
                .fuelType(car.getFuelType())
                .registrationImages(registrationImages)
                .certificateImages(certificateImages)
                .insuranceImages(insuranceImages)
                .mileage(car.getMileage())
                .fuelConsumption(car.getFuelConsumption())
                .description(car.getDescription())
                .carFunctionsInfo(carFunctionInfos)
                .basePrice(car.getBasePrice())
                .deposit(car.getDeposit())
                .carTermOfUses(carTermOfUse)
                .book_checked(book_checked)
                .car_type(car.getCarType().getName())
                .noOfRatings(feedbacks.size())
                .late_fee(carTermOfUseRepository.findLateFeeByCar(id) == null ? 0 : carTermOfUseRepository.findLateFeeByCar(id).getValue())

                .carOwnerId(car.getUser().getId())
                .carOwnerName(car.getUser().getName())
                .carOwnerAvatarUrl(userImagesRepository.findAvatarByUserId(car.getUser().getId())!=null ? userImagesRepository.findAvatarByUserId(car.getUser().getId()).getImageUrl(): null)
                .carOwnerAverageRating(roundedAverage)
                .carOwnerProvince(car.getUser().getProvince() != null ? car.getUser().getProvince().getName() : null)
                .carOwnerDistrict(car.getUser().getDistrict() != null ? car.getUser().getDistrict().getName() : null)


                .listCarFeedbackResponses(carFeedbackResponseList)
                .totalFeedbackPage(listFeedback.getTotalPages())
                .build();
    }

    //add car at step 1 for UC18 - Add a car
    @Transactional(rollbackFor = ApiException.class)
    @Override
    public CarStep1Respone addCarStep1(String token, Integer draftId, String type, List<MultipartFile> registration, List<MultipartFile> certificate, List<MultipartFile> insurance, CarStep1Request req) throws ApiException, IOException {
        String email = jwtService.getEmailFromToken(token);
        if (type.equalsIgnoreCase("CREATE")) {
            CarDraft carDraft = new CarDraft();
            carDraft.setStep(1);
            carDraft.setType(CarDraftType.CREATE);
            carDraft.setLicencePlate(req.getLicencePlate());
            CarModel carModel = getCarModelById(req.getCarModelId());
            String carName = carModel.getBrand().getName() + " " + carModel.getName();
            carDraft.setName(carName);
            carDraft.setCarModel(carModel);
            carDraft.setColor(req.getColor());
            carDraft.setProductionYear(req.getProductionYear());
            carDraft.setNoOfSeats(req.getNoOfSeats());
            carDraft.setTransmissionType(TransmissionType.valueOf(req.getTransmissionType().toUpperCase()));
            carDraft.setFuelType(FuelType.valueOf(req.getFuelType().toUpperCase()));
            carDraft.setUser(userRepository.findByEmail(email));
            carDraft.setCarType(getCarTypeById(req.getCarTypeId()));
            if(util.isLicencePlateExisted(carDraft.getLicencePlate())) {
                throw new ApiException(HttpStatus.CONFLICT.value(), "Licence plate already existed");
            }
            CarDraft saveCarDraft = carDraftRepository.save(carDraft);
            int carDraftId = saveCarDraft.getId();
            //Manage Paper---------------------------------
            if (validateFiles(registration, true) && validateFiles(certificate, true) && validateFiles(insurance, false)) {
                // Upload and save registration images
                saveCarImagesToDraft(registration, carDraftId, CarImageType.REGISTRATION_IMAGE);

                // Upload and save certificate images
                saveCarImagesToDraft(certificate, carDraftId, CarImageType.CERTIFICATE_IMAGE);

                // Upload and save insurance images
                saveCarImagesToDraft(insurance, carDraftId, CarImageType.INSURANCE_IMAGE);

            }

            return CarStep1Respone.builder()
                    .carDraftId(carDraftId)
                    .build();
        } else if (type.equalsIgnoreCase("UPDATE")) {
            if (req != null) {
                //--
                CarDraft carDraft = carDraftRepository.findCarDraftById(draftId);
                carDraft.setType(CarDraftType.CREATE);
                if(util.isLicencePlateExisted(carDraft.getLicencePlate())) {
                    throw new ApiException(HttpStatus.CONFLICT.value(), "Licence plate already existed");
                }
                carDraft.setLicencePlate(req.getLicencePlate());
                CarModel carModel = getCarModelById(req.getCarModelId());
                String carName = carModel.getBrand().getName() + " " + carModel.getName();
                carDraft.setName(carName);
                carDraft.setCarModel(carModel);
                carDraft.setColor(req.getColor());
                carDraft.setProductionYear(req.getProductionYear());
                carDraft.setNoOfSeats(req.getNoOfSeats());
                carDraft.setTransmissionType(TransmissionType.valueOf(req.getTransmissionType().toUpperCase()));
                carDraft.setFuelType(FuelType.valueOf(req.getFuelType().toUpperCase()));
                carDraft.setCarType(getCarTypeById(req.getCarTypeId()));
                carDraftRepository.save(carDraft);
                if (!registration.isEmpty() && !certificate.isEmpty()) {
                    //manage paper-----------
                    List<CarImages> oldRegister = carImagesRepository.findRegistrationImagesByDraftId(draftId);
                    List<CarImages> oldCertificate = carImagesRepository.findCertificateImagesByDraftId(draftId);
                    List<CarImages> oldInsurance = carImagesRepository.findInsuranceImagesByDraftId(draftId);
                    List<String> imgUrl = new ArrayList<>();
                    imgUrl.addAll(getImagesUrl(oldRegister));
                    imgUrl.addAll(getImagesUrl(oldCertificate));
                    imgUrl.addAll(getImagesUrl(oldInsurance));
                    for (String url : imgUrl) {
                        deleteFileByUrl(url);
                    }
                    carImagesRepository.deleteAll(oldRegister);
                    carImagesRepository.deleteAll(oldCertificate);
                    carImagesRepository.deleteAll(oldInsurance);
                    if (validateFiles(registration, true) && validateFiles(certificate, true) && validateFiles(insurance, false)) {
                        // Upload and save registration images
                        saveCarImagesToDraft(registration, draftId, CarImageType.REGISTRATION_IMAGE);

                        // Upload and save certificate images
                        saveCarImagesToDraft(certificate, draftId, CarImageType.CERTIFICATE_IMAGE);

                        // Upload and save insurance images
                        saveCarImagesToDraft(insurance, draftId, CarImageType.INSURANCE_IMAGE);

                    }

                }
                return null;
            } else {
                throw new ApiException(HttpStatus.NO_CONTENT.value(), "Missing required fields");
            }

        }

        return null;
    }

    //add car at step 2 for UC18 - Add a car
    @Transactional(rollbackFor = Exception.class)
    @Override
    public CarStep2Response  addCarStep2(int draftId, String type, List<MultipartFile> lists, CarStep2Request req) throws ApiException, IOException {
        if (type.equalsIgnoreCase("CREATE")) {
            if (!lists.isEmpty() && lists.size() != 5) {
                throw new ApiException(HttpStatus.NO_CONTENT.value(), "Car Image list does not contain 5 elements");
            }
            CarDraft carDraft = getCarDraftById(draftId);
            carDraft.setStep(2);
            carDraft.setMileage(req.getMileage());
            carDraft.setFuelConsumption(req.getFuelConsumption());
            carDraft.setProvince(provinceRepository.findById(req.getProvinceCode()).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "Province not found")));
            carDraft.setDistrict(districtRepository.findById(req.getDistrictCode()).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "District not found")));
            carDraft.setWard(wardRepository.findById(req.getWardCode()).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "Ward not found")));
            carDraft.setAddressDetail(req.getAddressDetails());
            carDraft.setDescription(req.getDescription());
            List<Integer> funtions = req.getCarFunctionsId();
            List<CarFunction> carFunctions = new ArrayList<>();
            for (int funtionId : funtions) {
                carFunctions.add(new CarFunction(carFunctionInfoRepository.GetByFuncId(funtionId), carDraft));
            }
            carFunctionRepository.saveAll(carFunctions);
            carDraftRepository.save(carDraft);

            for (MultipartFile file : lists) {
                if (validateFile(file, true)) {
                    String carImagePath = uploadImage(file);
                    //update data
                    CarImages carImages = CarImages.builder()
                            .imageUrl(carImagePath)
                            .carDraft(carDraftRepository.findCarDraftById(draftId))
                            .type(CarImageType.CAR_IMAGE)
                            .build();
                    carImagesRepository.save(carImages);
                }
            }
            return null;
        } else if (type.equalsIgnoreCase("UPDATE")) {
            if (req != null) {
                CarDraft carDraft = carDraftRepository.findCarDraftById(draftId);
                carDraft.setMileage(req.getMileage());
                carDraft.setFuelConsumption(req.getFuelConsumption());
                carDraft.setProvince(provinceRepository.findById(req.getProvinceCode()).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "Province not found")));
                carDraft.setDistrict(districtRepository.findById(req.getDistrictCode()).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "District not found")));
                carDraft.setWard(wardRepository.findById(req.getWardCode()).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "Ward not found")));
                carDraft.setAddressDetail(req.getAddressDetails());
                carDraft.setDescription(req.getDescription());
                carDraftRepository.save(carDraft);

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
                    List<String> imgUrl = getImagesUrl(oldCarImages);
                    for (String url : imgUrl) {
                        deleteFileByUrl(url);
                    }
                    carImagesRepository.deleteAll(oldCarImages);
                    if (validateFiles(lists, true)) {
                        // Upload and save registration images
                        saveCarImagesToDraft(lists, draftId, CarImageType.CAR_IMAGE);
                    }
                }
                return null;
            } else {
                throw new ApiException(HttpStatus.NOT_FOUND.value(), "Car Image not found");
            }
        }
        return null;
    }

    //add car at step 3 for UC18 - Add a car
    @Transactional(rollbackFor = ApiException.class)
    @Override
    public CarStep4Response addCarStep3(int draftId, String type, CarStep3Request req) throws ApiException {
        if (type.equalsIgnoreCase("CREATE") && req != null) {
            CarDraft carDraft = getCarDraftById(draftId);
            carDraft.setStep(3);
            carDraft.setBasePrice(req.getBasePrice());
            carDraft.setDeposit(req.getDeposit());
            List<String> terms = req.getCarTermOfUse();
            if (!terms.isEmpty()) {
                List<CarTermOfUse> termOfUses = new ArrayList<>();
                for (String term : terms) {
                    termOfUses.add(new CarTermOfUse(term, carDraft, TermOfUseType.GENERAL));
                }
                carTermOfUseRepository.saveAll(termOfUses);
            }
            carTermOfUseRepository.save(new CarTermOfUse(carDraft, TermOfUseType.LATE_FEE, req.getLateFee()));


            carDraftRepository.save(carDraft);
            String location = carDraft.getDistrict().getName() + ", " + carDraft.getProvince().getName();
            return CarStep4Response.builder()
                    .basePrice(carDraft.getBasePrice())
                    .carName(carDraft.getName())
                    .location(location)
                    .build();
        }
        if (type.equalsIgnoreCase("UPDATE")) {
            if (req != null) {
                CarDraft carDraft = carDraftRepository.findCarDraftById(draftId);
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


                carDraftRepository.save(carDraft);
                String location = carDraft.getDistrict().getName() + ", " + carDraft.getProvince().getName();
                return CarStep4Response.builder()
                        .basePrice(carDraft.getBasePrice())
                        .carName(carDraft.getName())
                        .location(location)
                        .build();
            }


        }
        return null;
    }

    //add car at step 4 for UC18 - Add a car
    @Override
    public CarStep4Response addCarStep4(int draftId) throws ApiException {
        CarDraft carDraft = getCarDraftById(draftId);
        carDraft.setStep(4);
        carDraftRepository.save(carDraft);
        String location = carDraft.getDistrict().getName() + ", " + carDraft.getProvince().getName();
        return CarStep4Response.builder()
                .basePrice(carDraft.getBasePrice())
                .carName(carDraft.getName())
                .location(location)
                .build();
    }

    //api for submit button in add car screen
    @Transactional(rollbackFor = ApiException.class)
    @Override
    public void addCarSubmitButton(int draftId) throws ApiException {
        CarDraft carDraft = getCarDraftById(draftId);
        carDraft.setStatus(CarDraftStatus.PENDING);
        carDraftRepository.save(carDraft);
    }

    @Override
    public CarDraftResponse getCarDraftProcess(String token) throws ApiException {
        String email = jwtService.getEmailFromToken(token);
        CarDraft carDraft = carDraftRepository.findNearestCarDraftByUserId(userRepository.findByEmail(email).getId(), "CREATE");
        if (carDraft == null) {
            return null;
        }
        List<CarImagesDTO> carImagesDTOList = new ArrayList<>();
        for (CarImages carImage : carDraft.getCarImages()) {
            carImagesDTOList.add(new CarImagesDTO(carImage.getId(), carImage.getImageUrl(), carImage.getType()));
        }
        Double lateFee = carTermOfUseRepository.findLateFeeByCarDraft(carDraft.getId()) == null ? 0 : carTermOfUseRepository.findLateFeeByCarDraft(carDraft.getId()).getValue();
        return CarDraftResponse.builder()
                .id(carDraft.getId())
                .name(carDraft.getName())
                .color(carDraft.getColor())
                .licencePlate(carDraft.getLicencePlate())
                .productionYear(carDraft.getProductionYear())
                .mileage(carDraft.getMileage())
                .noOfSeats(carDraft.getNoOfSeats())
                .transmissionType(carDraft.getTransmissionType())
                .fuelType(carDraft.getFuelType())
                .fuelConsumption(carDraft.getFuelConsumption())
                .deposit(carDraft.getDeposit())
                .description(carDraft.getDescription())
                .basePrice(carDraft.getBasePrice())
                .addressDetail(carDraft.getAddressDetail())
                .type(carDraft.getType())
                .status(carDraft.getStatus())
                .step(carDraft.getStep())
                .provinceCode((carDraft.getProvince() != null) ? carDraft.getProvince().getCode() : null)
                .districtCode((carDraft.getDistrict() != null) ? carDraft.getDistrict().getCode() : null)
                .wardCode((carDraft.getWard() != null) ? carDraft.getWard().getCode() : null)
                .carModel(new CarModelDTO(carDraft.getCarModel().getId(), carDraft.getCarModel().getName()))
                .carBrand(new CarBrandDTO(carDraft.getCarModel().getBrand().getId(), carDraft.getCarModel().getBrand().getName()))
                .carType(carDraft.getCarType())
                .carTermOfUses(carDraft.getCarTermOfUses().stream().map(x -> x.getTerm()).toList())
                .carImages(carImagesDTOList)
                .carFunctionsId(carDraft.getCarFunctions().stream().map(x -> x.getCarFunctionInfo().getId()).toList())
                .lateFee(lateFee)
                .build();
    }

    @Override
    public MyCarPageResponse getListCar(String token, String sort, int Page, int Size) {

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
        return getListCarResponse(token, pageable);
    }

    public MyCarPageResponse getListCarResponse(String token, Pageable pageable) {
        String email = jwtService.getEmailFromToken(token);
        User user = userRepository.findByEmail(email);
        Page<Car> carPage = carRepository.getCarById(user.getId(), pageable);
        List<MyCarResponse> listCarResponse = carPage.getContent().stream().map(carRepository -> MyCarResponse.builder()
                .carImagesUrl(getImagesUrl(carImagesRepository.findCarImagesByCarId(carRepository.getId())))
                .brand(carRepository.getCarModel().getBrand().getName())
                .model(carRepository.getCarModel().getName())
                .rating(getAverageRating(carRepository.getFeedbacks()))
                .noOfRides(findBookingByCarId(carRepository.getId()).size())
                .basePrice(carRepository.getBasePrice())
                .district(carRepository.getDistrict().getName())
                .province(carRepository.getProvince().getName())
                .status(carRepository.getStatus().toString())
                .carId(carRepository.getId())
                .licensePlate(carRepository.getLicencePlate())
                .build()
        ).toList();
        MyCarPageResponse response = new MyCarPageResponse();
        response.setPageNumber(carPage.getNumber() + 1);
        response.setPageSize(pageable.getPageSize());
        response.setTotalElements(carPage.getNumberOfElements());
        response.setTotalPages(carPage.getTotalPages());
        response.setMyListCar(listCarResponse);
        return response;
    }

    //get car by id
    public Car findCarById(int id) throws ApiException {
        return carRepository.findById(id).orElseThrow(() -> new ApiException(404, "Car not found"));

    }

    //get average rating in list of feedback
    public double getAverageRating(List<Feedback> feedbacks) {
        if (feedbacks == null || feedbacks.isEmpty()) {
            return 0.0;
        }
        double average = feedbacks.stream()
                .mapToDouble(Feedback::getRating)
                .average()
                .orElse(0.0);

        return Math.round(average * 2) / 2.0;
    }

    //get list booking by carId

    public List<Booking> findBookingByCarId(int id) {
        return bookingRepository.findBookingByCarId(id);
    }

    //get carmodel by id
    public CarModel getCarModelById(int id) throws ApiException {
        if (carModelRepository.findById(id) == null)
            throw new ApiException(HttpStatus.NOT_FOUND.value(), "Can not find Car Model");
        else return carModelRepository.findById(id);
    }

    //get user by id
    public User getUserById(int id) throws ApiException {
        return userRepository.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "Can not find User"));
    }

    //get car type by id
    public CarType getCarTypeById(int id) throws ApiException {
        return carTypeRepository.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "Can not find Car Type"));
    }

    // get list url from list<carImage>
    public List<String> getImagesUrl(List<CarImages> carImages) {
        return carImages.stream()
                .map(CarImages::getImageUrl)
                .collect(Collectors.toList());
    }

    //ANHCP2

    @Override
    public Page<CarSearchResultResponse> searchAvailableCars(CarSearchRequestDTO request, Pageable pageable) throws ApiException {

        int page = request.getPageNumber() > 0 ? request.getPageNumber() - 1 : 0; // Page trong Spring Boot bắt đầu từ 0
        pageable = PageRequest.of(page, request.getPageSize());


        if (request.getPickupDate() != null && request.getDropoffDate() != null &&
                request.getPickupDate().after(request.getDropoffDate())) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Pickup date must be before dropoff date");
        }

        Double minPrice = request.getMinPrice();
        Double maxPrice = request.getMaxPrice();
        if (minPrice != null && maxPrice != null && minPrice > maxPrice) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Min price must be less than max price");
        }

        Province province = (request.getProvinceCode() != null)
                ? provinceRepository.findById(request.getProvinceCode()).orElse(null)
                : null;

        District district = (request.getDistrictCode() != null)
                ? districtRepository.findById(request.getDistrictCode()).orElse(null)
                : null;

        Ward ward = (request.getWardCode() != null)
                ? wardRepository.findById(request.getWardCode()).orElse(null)
                : null;

        CarBrand brand = (request.getBrandId() != null)
                ? carBrandRepository.findById(request.getBrandId()).orElse(null)
                : null;


        if (request.getDistrictCode() != null) {

            if (province != null && !district.getProvince().getCode().equals(province.getCode())) {
                throw new ApiException(HttpStatus.BAD_REQUEST.value(), "District does not belong to the given Province");
            }
        }

        if (request.getWardCode() != null) {
            if (district != null && !ward.getDistrict().getCode().equals(district.getCode())) {
                throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Ward does not belong to the given District");
            }
        }
        if (request.getModelId() != null && request.getModelId().isEmpty()) {
            request.setModelId(null);
        }


        if (request.getModelId() != null && !request.getModelId().isEmpty()) {
            for (Integer modelId : request.getModelId()) {
                CarModel model = carModelRepository.findById(modelId)
                        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "Model not found"));

                if (brand != null && !(model.getBrand().getId() == (brand.getId()))) {
                    throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Model does not belong to the given Brand");
                }
            }
        }

        Page<Car> carPage = carRepository.searchAvailableCars(
                request.getProvinceCode(), request.getDistrictCode(), request.getWardCode(),
                request.getPickupDate(), request.getDropoffDate(),
                request.getName(), request.getBrandId(), request.getModelId(),
                request.getFuelType(), request.getTransmissionType(), request.getColor(),
                minPrice, maxPrice, pageable
        );

        return carPage.map(car -> {
            Object[] stats = carRepository.getCarStats(car.getId(), BookingStatus.COMPLETED);
            double averageRating = 0.0;
            int numberOfBookings = 0;

            if (stats != null && stats.length > 0 && stats[0] instanceof Object[]) {
                Object[] row = (Object[]) stats[0];
                averageRating = row[0] != null ? ((Number) row[0]).doubleValue() : 0.0;
                numberOfBookings = row[1] != null ? ((Number) row[1]).intValue() : 0;
            }

            String imageUrl = car.getCarImages() != null && !car.getCarImages().isEmpty()
                    ? car.getCarImages().stream()
                    .filter(carImage -> carImage.getType().equals(CarImageType.CAR_IMAGE)) // Lọc ảnh có type là CAR_IMAGE
                    .map(carImages -> carImages.getImageUrl()).findFirst() // Lấy ảnh đầu tiên nếu có
                    .orElse("default-car-image.jpg") // Nếu không có ảnh nào thì lấy ảnh mặc định
                    : "default-car-image.jpg";
            Date pickupDate = request.getPickupDate();
            Date dropoffDate = request.getDropoffDate();

            Booking nearestBooking = bookingRepository.checkNearestBooking(
                    car.getId(),
                    pickupDate,
                    dropoffDate
            );

            List<Map<String, String>> bookingPeriods = new ArrayList<>();
            if (nearestBooking != null) {
                ZoneId vietnamZone = ZoneId.of("Asia/Ho_Chi_Minh");

                LocalDateTime startDateVN = nearestBooking.getStartDate().toInstant().atZone(vietnamZone).toLocalDateTime();
                LocalDateTime endDateVN = nearestBooking.getEndDate().toInstant().atZone(vietnamZone).toLocalDateTime();

                bookingPeriods.add(Map.of(
                        "startDate", startDateVN.toString(),
                        "endDate", endDateVN.toString()
                ));
            }
            boolean isBooked = !bookingPeriods.isEmpty();

            return new CarSearchResultResponse(
                    car.getId(),
                    car.getName(),
                    car.getCarModel().getBrand().getName(),
                    car.getCarModel().getName(),
                    averageRating,
                    numberOfBookings,
                    car.getDistrict() != null ? car.getDistrict().getName() : null,
                    (car.getDistrict() != null && car.getDistrict().getProvince() != null)
                            ? car.getDistrict().getProvince().getName()
                            : null,
                    imageUrl,
                    isBooked ? "BOOKED" : car.getStatus().name(),
                    car.getBasePrice(),
                    car.getFuelType().name(),
                    car.getColor(),
                    car.getTransmissionType().name(),
                    car.getCarType().getName(),
                    car.getProductionYear(),
                    car.getLicencePlate(),
                    bookingPeriods,
                    car.getNoOfSeats()
            );
        });
    }


    @Override
    public List<CarType> getAllCarType() {
        List<CarType> carType = carTypeRepository.findAll();
        return carType;
    }

    @Override
    public List<CarFunctionInfo> getCarFunction() {
        return carFunctionInfoRepository.findAll();
    }

    @Override
    public CarInformationResponse getEditCarScreenInformation(int carId) throws ApiException {
        Car car = getCarById(carId);
        List<Feedback> feedbacks = car.getFeedbacks();
        double averageRate = getAverageRating(feedbacks);
        String location = car.getDistrict().getName() + ", " + car.getProvince().getName();
        List<CarImagesDTO> carImagesDTOList = new ArrayList<>();
        for (CarImages carImage : car.getCarImages()) {
            carImagesDTOList.add(new CarImagesDTO(carImage.getId(), carImage.getImageUrl(), carImage.getType()));
        }
        Double lateFee = carTermOfUseRepository.findLateFeeByCar(carId).getValue();
        return CarInformationResponse.builder()
                .name(car.getName())
                .noOfRatings(feedbacks.size())
                .rating(averageRate)
                .location(location)
                .noOfRides(findBookingByCarId(carId).size())
                .status(car.getStatus())
                .color(car.getColor())
                .licencePlate(car.getLicencePlate())
                .productionYear(car.getProductionYear())
                .mileage(car.getMileage())
                .noOfSeats(car.getNoOfSeats())
                .transmissionType(car.getTransmissionType())
                .fuelType(car.getFuelType())
                .fuelConsumption(car.getFuelConsumption())
                .deposit(car.getDeposit())
                .description(car.getDescription())
                .basePrice(car.getBasePrice())
                .addressDetail(car.getAddressDetail())
                .provinceCode((car.getProvince() != null) ? car.getProvince().getCode() : null)
                .districtCode((car.getDistrict() != null) ? car.getDistrict().getCode() : null)
                .wardCode((car.getWard() != null) ? car.getWard().getCode() : null)
                .carModel(new CarModelDTO(car.getCarModel().getId(), car.getCarModel().getName()))
                .carBrand(new CarBrandDTO(car.getCarModel().getBrand().getId(), car.getCarModel().getBrand().getName()))
                .carType(car.getCarType())
                .carTermOfUses(car.getCarTermOfUses().stream().map(x -> x.getTerm()).toList())
                .carImages(carImagesDTOList)
                .carFunctionsId(car.getCarFunctions().stream().map(x -> x.getCarFunctionInfo().getId()).toList())
                .lateFee(lateFee)
                .build();
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void deleteCarDraft(int draftId) throws ApiException {
        CarDraft carDraft = getCarDraftById(draftId);
        carDraft.setIsDeleted(true);
        carDraftRepository.save(carDraft);
    }
    @Override
    public void deleteCarDraftOutOfDatabase(String token , int draftId) throws ApiException {
        String email = jwtService.getEmailFromToken(token);
        User carOwner = userRepository.findByEmail(email);
        CarDraft carDraft = getCarDraftById(draftId);
        if(carDraft.getUser() != carOwner) { throw new ApiException(HttpStatus.UNAUTHORIZED.value(), "Car owner not found!, You can not edit this car draft."); }
        List<CarImages> carImages = carImagesRepository.findCarImagesByDraftId(draftId);
        List<CarImages> certificate = carImagesRepository.findCertificateImagesByDraftId(draftId);
        List<CarImages> insurance = carImagesRepository.findInsuranceImagesByDraftId(draftId);
        List<CarImages> registration = carImagesRepository.findRegistrationImagesByDraftId(draftId);
        carImagesRepository.deleteAll(certificate);
        carImagesRepository.deleteAll(carImages);
        carImagesRepository.deleteAll(insurance);
        carImagesRepository.deleteAll(registration);

        List<CarTermOfUse> termOfUses = carTermOfUseRepository.findByCarDraft(carDraft);
        if (termOfUses != null && !termOfUses.isEmpty()) {
            carTermOfUseRepository.deleteAll(termOfUses);
        }
        List<CarFunction> carFunctions = carFunctionRepository.findByCarDraft(carDraft);
        if (carFunctions != null && !carFunctions.isEmpty()) {
            carFunctionRepository.deleteAll(carFunctions);
        }
        carDraftRepository.delete(carDraft);
    }

    @Override
    public void deleteCar(String token,int carId) throws ApiException {
        Car car = getCarById(carId);
        String email = jwtService.getEmailFromToken(token);
        User carOwner = userRepository.findByEmail(email);
        if(car.getUser() != carOwner) { throw new ApiException(HttpStatus.UNAUTHORIZED.value(), "Car owner not found!, You can not edit this car draft."); }
        car.setDeleted(true);
        carRepository.save(car);
    }

    //ANHCP2
    @Override
    public List<CarBrandResponse> getAllBrands() {
        return carRepository.findAllBrands();
    }

    @Override
    public List<CarModelResponse> getModelsByBrand(Integer brandId) {
        return carRepository.findModelsByBrand(brandId);
    }

    @Override
    public List<String> getAllColors() {
        return carRepository.findDistinctColors();
    }

    @Override
    public Double getMaxPrice() {
        return carRepository.findMaxPrice();
    }


    //validate muiltipartfile
    public boolean validateFile(MultipartFile files, boolean require) throws ApiException {
        if (!require) return true;
        if (files.isEmpty()) {
            throw new ApiException(HttpStatus.NOT_FOUND.value(), "File not found");
        }
        List<String> allowedTypes = Arrays.asList(
                "image/jpeg", "image/png", "image/jpg",
                "application/pdf", "application/msword", // .doc
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
                "application/octet-stream"
        );

        if (files.getSize() > 5 * 1024 * 1024) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "File too large");
        }
        if (!allowedTypes.contains(files.getContentType())) {
            throw new ApiException(HttpStatus.UNSUPPORTED_MEDIA_TYPE.value(), "Invalid file type");
        }
        return true;
    }

    //validate list<multipartfile>
    public boolean validateFiles(List<MultipartFile> files, boolean require) throws ApiException {
        if (require && (files == null || files.isEmpty())) {
            throw new ApiException(HttpStatus.NOT_FOUND.value(), "No files provided");
        }

        for (MultipartFile file : files) {
            validateFile(file, require); // Gọi validateFile() để kiểm tra từng file
        }

        return true;
    }

    //Save car image in uploads folder and database draft
    public void saveCarImagesToDraft(List<MultipartFile> files, int carDraftId, CarImageType imageType) {

        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue; // Bỏ qua file rỗng
            }
            try {
                String filePath = uploadImage(file); // Upload từng file
                CarImages imageData = CarImages.builder()
                        .imageUrl(filePath)
                        .carDraft(carDraftRepository.findCarDraftById(carDraftId))
                        .type(imageType)
                        .build();
                carImagesRepository.save(imageData); // Lưu vào database
            } catch (IOException e) {
                e.printStackTrace(); // Xử lý lỗi upload file
            }
        }


    }

    //Save car image in uploads folder and database car
    public void saveCarImagesToCar(List<MultipartFile> files, int carId, CarImageType imageType) throws ApiException {
        for (MultipartFile file : files) {
            try {
                String filePath = uploadImage(file); // Upload từng file
                CarImages imageData = CarImages.builder()
                        .imageUrl(filePath)
                        .car(getCarById(carId))
                        .type(imageType)
                        .build();
                carImagesRepository.save(imageData); // Lưu vào database
            } catch (IOException e) {
                e.printStackTrace(); // Xử lý lỗi upload file
            }
        }
    }

    //upload image in uploads folder
    //Function to uploadImage
    public String uploadImage(MultipartFile file) throws IOException {
        Date date = new Date();
        String extension = "";
        String fileName = file.getOriginalFilename();
        if (fileName != null && fileName.contains(".")) {
            extension = fileName.substring(fileName.lastIndexOf("."));
        }
        String newName = UUID.randomUUID().toString() + extension;
        Path filePath = Paths.get(UPLOAD_DIR, newName);
        // Lưu file vào thư mục "uploads"
        file.transferTo(filePath.toFile());  // Chuyển file vào thư mục
        String savePath = "http://localhost:8080/uploads/" + newName;
        return savePath;
    }

    //delete file
    public boolean deleteFile(String fileName) throws ApiException {
        try {
            Path filePath = Paths.get(UPLOAD_DIR, fileName);
            return Files.deleteIfExists(filePath); // Xóa file nếu tồn tại
        } catch (IOException e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Can not delete file");
        }
    }

    public boolean deleteFileByUrl(String fileUrl) throws ApiException {
        String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1); // Lấy tên file từ URL
        return deleteFile(fileName);
    }

    //get car draft by id
    public CarDraft getCarDraftById(int id) throws ApiException {
        return carDraftRepository.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "draft not found"));
    }

    //get car  by id
    public Car getCarById(int id) throws ApiException {
        return carRepository.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "car not found"));
    }

    //check if user is book that car or not
    public boolean isUserBookingCarChecked(String token, int car_id) throws ApiException {
        String email = jwtService.getEmailFromToken(token);
        User user = userRepository.findByEmail(email);
        return bookingRepository.checkUserBookingCar(user.getId(), car_id) != null
                && !bookingRepository.checkUserBookingCar(user.getId(), car_id).isEmpty();

    }

    //check if that car have booked between start date and end date or not
    public Booking checkBookingCar(int carId, Date startDate, Date endDate) throws ApiException {
        Booking booking = bookingRepository.checkNearestBooking(carId, startDate, endDate);

        return booking;
    }






}
