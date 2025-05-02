package com.pjb2.rental_car.service.impl;

import com.pjb2.rental_car.dto.request.AddUserRequestDTO;
import com.pjb2.rental_car.dto.request.AdminVoucherEditRequest;
import com.pjb2.rental_car.dto.request.AdminVoucherRequest;
import com.pjb2.rental_car.dto.response.*;
import com.pjb2.rental_car.entity.*;
import com.pjb2.rental_car.exception.ApiException;
import com.pjb2.rental_car.repository.UserImagesRepository;
import com.pjb2.rental_car.repository.UserRepository;
import com.pjb2.rental_car.repository.*;
import com.pjb2.rental_car.service.AdminService;
import com.pjb2.rental_car.service.EmailService;
import com.pjb2.rental_car.util.JwtService;
import com.pjb2.rental_car.util.Util;
import com.pjb2.rental_car.util.common.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.xmlbeans.impl.xb.xsdschema.Attribute;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;


import java.util.List;

import static java.util.Comparator.comparing;


@Service
@Slf4j
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final UserRepository userRepository;
    private final UserImagesRepository userImagesRepository;
    private final EmailService emailService;
    private final CarServiceImpl carServiceImpl;
    private final CarRepository carRepository;
    private final CarTermOfUseRepository carTermOfUseRepository;
    private final CarFunctionRepository carFunctionRepository;
    private final CarImagesRepository carImagesRepository;
    private final CarDraftRepository carDraftRepository;
    private final UserDraftRepository userDraftRepository;
    private final CarBrandRepository carBrandRepository;
    private final VoucherRepository voucherRepository;
    private final CarModelRepository carModelRepository;
    private final SystemImageRepository systemImageRepository;
    private final CarOwnerServiceImpl carOwnerServiceImpl;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final WalletRepository walletRepository;
    private final BookingRepository bookingRepository;
    private final WalletHistoryRepository walletHistoryRepository;
    private final Util util;

    @Override
    public Page<UserDetailResponse> listAllUsers(int page) {
        int pageNumber = (page > 0) ? page - 1 : 0;
        int size = 10;
        Pageable pageable = PageRequest.of(pageNumber, size);
        Page<User> users = userRepository.findAll(pageable);
        return users.map(this::mapToUserDetailResponse);
    }

    @Override
    public Page<UserDetailResponse> searchUsers(
            String name, String email, Integer roleId, UserStatus status, Boolean isBan, Integer page, String sort) {

        int pageNumber = (page != null && page > 0) ? page - 1 : 0;
        int pageSize = 10;

        Sort.Direction direction = Sort.Direction.ASC;
        if ("desc".equalsIgnoreCase(sort)) {
            direction = Sort.Direction.DESC;
        }

        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(direction, "createdAt"));

        Page<User> users = userRepository.findUsers(name, email, roleId, status, isBan, pageable);

        return users.map(this::mapToUserDetailResponse);
    }





    private UserDetailResponse mapToUserDetailResponse(User user) {
        String avatarUrl = userImagesRepository.findAvatarByUserId(user.getId()) != null
                ? userImagesRepository.findAvatarByUserId(user.getId()).getImageUrl()
                : "default-avatar.jpg";
        return UserDetailResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .nationalId(user.getNationalId())
                .email(user.getEmail())
                .phone(user.getPhone())
                .dob(user.getDob())
                .addressDetail(
                        (user.getDistrict() != null ? user.getDistrict().getName() : "") + ", " +
                                (user.getProvince() != null ? user.getProvince().getName() : "")
                )
                .roles(user.getRoles().stream().map(Role::getName).toList())
                .status(user.getStatus().name())
                .avatarUrl(avatarUrl)
                .banStatus(user.isBan())
                .banDuration(user.getBanDuration())
                .build();
    }

    @Override
    @Transactional
    public void sendEmailToUser(int userId, String subject, String content) throws ApiException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "User not found"));
        emailService.sendEmail(user.getEmail(), subject, content);
    }

    @Override
    @Transactional
    public void banUser(int userId, int hours, String reason) throws ApiException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "User not found"));
        if (user.isBan()) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "User is already banned");
        }

        user.setBan(true);
        user.setBanStartTime(LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")));
        user.setBanDuration(hours);
        user.setBanReason(reason);
        userRepository.save(user);
        String formattedTime = formatDuration(hours);
        String subject = "Your Account Has Been Banned";
        String content = "<h1>Your account has been banned</h1>" +
                "<p>Reason: " + reason + "</p>" +
                "<p>You have been banned for " + formattedTime + ".</p>";

        emailService.sendEmail(user.getEmail(), subject, content);
    }


    @Override
    @Transactional
    public void unbanUser(int userId) throws ApiException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "User not found"));

        if (!user.isBan()) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "User is not banned");
        }

        user.setBan(false);
        user.setBanStartTime(null);
        user.setBanDuration(0);
        user.setBanReason(null);
        userRepository.save(user);

        String subject = "Your Account Has Been Unbanned";
        String content = "<h1>Your account has been restored</h1>" +
                "<p>You can now use our services again.</p>";

        emailService.sendEmail(user.getEmail(), subject, content);
    }

    @Override
    public String formatDuration(long totalHours) {
        long days = totalHours / 24;
        long hours = totalHours % 24;
        return String.format("%d day%s %d hour%s",
                days, days == 1 ? "" : "s",
                hours, hours == 1 ? "" : "s");
    }

    public boolean checkBanStatus(int userId) throws ApiException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "User not found"));

        if (!user.isBan() || user.getBanStartTime() == null) {
            return false;
        }

        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        LocalDateTime banStartTime = user.getBanStartTime();
        LocalDateTime banEndTime = banStartTime.plus(user.getBanDuration(), ChronoUnit.HOURS);
        if (now.isAfter(banEndTime)) {
            unbanUser(userId);
            return false;
        }

        return true;
    }





//    @Scheduled(cron = "0 0 0 * * ?")
//    public void autoUnbanUsers() throws ApiException{
//        List<User> bannedUsers = userRepository.findAllByIsBanTrue();
//
//        for (User user : bannedUsers) {
//            if (user.getBanDay() == 1 || user.getBanDay() <= 0) {
//                unbanUser(user.getId());
//            } else {
//                decreaseBanDay(user);
//            }
//        }
//    }
//
//
//    @Transactional
//    public void decreaseBanDay(User user) {
//        user.setBanDay(user.getBanDay() - 1);
//        userRepository.save(user);
//    }

    @Override
    public CarRequestPageResponse getListCarRequest(String sort, int page, int size,String status, String type) throws ApiException {
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
        return ListCarRequestResponse(status,type,pageable);
    }

    public CarRequestPageResponse ListCarRequestResponse(String status, String type,Pageable pageable) throws ApiException {
          Page<CarDraft> carRequestPage = carDraftRepository.findAllCarDraftRequest(status,type,pageable);

          List<CarRequestResponse> carRequestResponseList = carRequestPage.getContent().stream().map(carDraft -> CarRequestResponse.builder()
                  .draftId(carDraft.getId())
                  .carImgUrl(carImagesRepository.findCarImagesByDraftId(carDraft.getId()).isEmpty() ? null :  carImagesRepository.findCarImagesByDraftId(carDraft.getId()).get(0).getImageUrl())
                  .carName(carDraft.getName())
                  .userName(carDraft.getUser().getName())
                  .requestTime(carDraft.getCreatedAt())
                  .type(carDraft.getType().toString())
                  .status(carDraft.getStatus().toString())
                  .rejectMessage(carDraft.getRejectMessage())
                  .build()).toList();
          CarRequestPageResponse response = new CarRequestPageResponse();
          response.setPageNumber(carRequestPage.getNumber() + 1);
          response.setPageSize(pageable.getPageSize());
          response.setTotalElements(carRequestPage.getNumberOfElements());
          response.setTotalPages(carRequestPage.getTotalPages());
          response.setListCarRequestResponses(carRequestResponseList);
          response.setNoOfPendingRequests(carDraftRepository.findByStatus("PENDING").isEmpty()  ? 0 : carDraftRepository.findByStatus("PENDING").size());
          response.setNoOfAcceptedRequests(carDraftRepository.findByStatus("ALLOW").isEmpty() ? 0 : carDraftRepository.findByStatus("ALLOW").size());
          response.setNoOfRejectedRequests(carDraftRepository.findByStatus("REJECT").isEmpty() ? 0 : carDraftRepository.findByStatus("REJECT").size());
        return response;
    }
    @Transactional(rollbackFor = ApiException.class)
    @Override
    public void addCarRequestAccept(int draftId) throws ApiException {
        CarDraft carDraft = carServiceImpl.getCarDraftById(draftId);
        if(!(carDraft.getStatus()==CarDraftStatus.PENDING)) { throw new ApiException(HttpStatus.NO_CONTENT.value(), "This request has already been admit by other"); }
        carDraft.setStatus(CarDraftStatus.ALLOW);
        carDraftRepository.save(carDraft);
        Car car = new Car();
        car.setName(carDraft.getName());
        car.setColor(carDraft.getColor());
        car.setLicencePlate(carDraft.getLicencePlate());
        car.setStatus(CarStatus.STOPPED);
        car.setProductionYear(carDraft.getProductionYear());
        car.setMileage(carDraft.getMileage());
        car.setTransmissionType(carDraft.getTransmissionType());
        car.setFuelType(carDraft.getFuelType());
        car.setFuelConsumption(carDraft.getFuelConsumption());
        car.setDeposit(carDraft.getDeposit());
        car.setDescription(carDraft.getDescription());
        car.setBasePrice(carDraft.getBasePrice());
        car.setAddressDetail(carDraft.getAddressDetail());
        car.setNoOfSeats(carDraft.getNoOfSeats());
        car.setUser(carDraft.getUser());
        car.setCarModel(carDraft.getCarModel());
        car.setCarType(carDraft.getCarType());
        car.setProvince(carDraft.getProvince());
        car.setDistrict(carDraft.getDistrict());
        car.setWard(carDraft.getWard());
        Car saveCar = carRepository.save(car);
        int id = saveCar.getId();
        carTermOfUseRepository.setCarTermOfUse(draftId, id);
        carFunctionRepository.setCarFunction(draftId, id);
        carImagesRepository.setCarImg(draftId, id);
        carServiceImpl.deleteCarDraft(draftId);
        String bodyMail = "<p>Your "+carDraft.getName()+" "+carDraft.getLicencePlate()+"request have been accepted</p>"+
                "\n<p>Click <a href='http://localhost:5173/car-owner/car-list'>here</a> to see your car</p>";
        emailService.sendEmail(carDraft.getUser().getEmail(),"Accept create car request",bodyMail);

    }
    @Transactional(rollbackFor = ApiException.class)
    @Override
    public void addCarRequestReject(int draftId, String message) throws ApiException {
        CarDraft carDraft = carServiceImpl.getCarDraftById(draftId);
        if(!(carDraft.getStatus()==CarDraftStatus.PENDING)) { throw new ApiException(HttpStatus.NO_CONTENT.value(), "This request has already been admit by other"); }
        carDraft.setStatus(CarDraftStatus.REJECT);
        carDraft.setRejectMessage(message);
        carDraftRepository.save(carDraft);
        String bodyMail = "<p>Your "+carDraft.getName()+" "+carDraft.getLicencePlate()+"request have been rejected</p>"+
                            "\n<p>reason: "+message+", click <a href='http://localhost:5173/car-owner/car-list'>here</a> to edit your car request again  </p>";
        emailService.sendEmail(carDraft.getUser().getEmail(),"Reject create car request",bodyMail);
    }
    @Override
    public CarDraftResponse getCarRequestDetail(int draftId) throws ApiException {
        CarDraft carDraft = carDraftRepository.findCarDraftById(draftId);
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
                .rejectMessage(carDraft.getRejectMessage())
                .build();
    }
    @Transactional(rollbackFor = ApiException.class)
    @Override
    public void updateCarRequestAccept(int draftId) throws ApiException {
        CarDraft carDraft = carServiceImpl.getCarDraftById(draftId);
        if(!(carDraft.getStatus()==CarDraftStatus.PENDING)) { throw new ApiException(HttpStatus.NO_CONTENT.value(), "This request has already been admit by other"); }
        carDraft.setStatus(CarDraftStatus.ALLOW);
        carDraftRepository.save(carDraft);
        Car car = carDraft.getCar();
        car.setName(carDraft.getName());
        car.setColor(carDraft.getColor());
        car.setLicencePlate(carDraft.getLicencePlate());
        car.setStatus(CarStatus.STOPPED);
        car.setProductionYear(carDraft.getProductionYear());
        car.setMileage(carDraft.getMileage());
        car.setTransmissionType(carDraft.getTransmissionType());
        car.setFuelType(carDraft.getFuelType());
        car.setFuelConsumption(carDraft.getFuelConsumption());
        car.setDeposit(carDraft.getDeposit());
        car.setDescription(carDraft.getDescription());
        car.setBasePrice(carDraft.getBasePrice());
        car.setAddressDetail(carDraft.getAddressDetail());
        car.setNoOfSeats(carDraft.getNoOfSeats());
        car.setUser(carDraft.getUser());
        car.setCarModel(carDraft.getCarModel());
        car.setCarType(carDraft.getCarType());
        car.setProvince(carDraft.getProvince());
        car.setDistrict(carDraft.getDistrict());
        car.setWard(carDraft.getWard());
        car.setDeleted(false);
        carRepository.save(car);
        int carId = car.getId();
        carTermOfUseRepository.deleteCarTermOfUse(carId);
        carTermOfUseRepository.setCarTermOfUse(draftId, carId);
        carFunctionRepository.deleteCarFunction(carId);
        carFunctionRepository.setCarFunction(draftId, carId);
        carImagesRepository.deleteCarImg(carId);
        carImagesRepository.setCarImg(draftId, carId);
        carServiceImpl.deleteCarDraft(draftId);
        String bodyMail = "<p>Your "+carDraft.getName()+" "+carDraft.getLicencePlate()+"request have been accepted</p>"+
                "\n<p>Click <a href='http://localhost:5173/car-owner/car-list'>here</a> to see your car</p>";
        emailService.sendEmail(carDraft.getUser().getEmail(),"Accept update car request",bodyMail);
    }
    @Transactional(rollbackFor = ApiException.class)
    @Override
    public void updateCarRequestReject(int draftId,String message) throws ApiException {
        CarDraft carDraft = carServiceImpl.getCarDraftById(draftId);
        if(!(carDraft.getStatus()==CarDraftStatus.PENDING)) { throw new ApiException(HttpStatus.NO_CONTENT.value(), "This request has already been admit by other"); }
        carDraft.setStatus(CarDraftStatus.REJECT);
        carDraft.setRejectMessage(message);
        carDraftRepository.save(carDraft);
        String bodyMail = "<p>Your "+carDraft.getName()+" "+carDraft.getLicencePlate()+"request have been rejected</p>"+
                "\n<p>reason: "+message+", click <a href='http://localhost:5173/car-owner/car-list'>here</a> to edit your car request again  </p>";
        emailService.sendEmail(carDraft.getUser().getEmail(),"Reject update car request",bodyMail);
    }

    //ANHCP2
    @Transactional
    @Override
    public void approveUserDraft(int draftId) throws ApiException {
        UserDraft draft = userDraftRepository.findById(draftId)
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST.value(), "User draft not found!"));

        User user = draft.getUser();
        if (user == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "User associated with this draft does not exist!");
        }
        if (draft.getStatus() != UserDraftStatus.PENDING) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Draft status is not pending!");
        }

        // Tìm draft cũ nhất có userId để xóa user
        List<UserImages> licenseImages = draft.getUserImages().stream()
                .filter(img -> img.getType() == UserImageType.LICENSE_DRIVER)
                .toList();

        if (!licenseImages.isEmpty()) {
            Optional<UserDraft> previousDraft = userDraftRepository.findPreviousDraftWithUser(user.getId(), draftId);
            previousDraft.ifPresent(oldDraft -> {
                userImagesRepository.resetUserInAllOldLicenseDrafts(user.getId());
            });

            licenseImages.forEach(img -> img.setUser(user));
            userImagesRepository.saveAll(licenseImages);
        }


        // Cập nhật thông tin từ draft mới vào user
        user.setName(draft.getName());
        user.setNationalId(draft.getNationalId());
        user.setPhone(draft.getPhone());
        user.setDob(draft.getDob());
        user.setAddressDetail(draft.getAddressDetail());
        user.setProvince(draft.getProvince());
        user.setDistrict(draft.getDistrict());
        user.setWard(draft.getWard());
        user.setPrice(draft.getPrice());
        user.setLateFee(draft.getLateFee());
        user.setDriverExp(draft.getDriverExp());
        user.setDescription(draft.getDescription());

        // Set user cho draft được duyệt
        draft.setUser(user);

        // Lấy ảnh LICENSE_DRIVER từ draft này
        licenseImages = draft.getUserImages() != null
                ? draft.getUserImages().stream()
                .filter(img -> img.getType() == UserImageType.LICENSE_DRIVER)
                .toList()
                : new ArrayList<>();

        // **Set user cho ảnh trong draft mới**
        licenseImages.forEach(img -> img.setUser(user));
        userImagesRepository.saveAll(licenseImages);

        draft.setDeleted(true);
        draft.setStatus(UserDraftStatus.ACCEPTED);
        userDraftRepository.save(draft);

        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);

        emailService.sendEmail(user.getEmail(), "Profile Approved",
                "Your profile update has been approved. You can now use all features.");
    }

    @Transactional
    @Override
    public void rejectUserDraft(int draftId, String reason) throws ApiException {
        UserDraft draft = userDraftRepository.findById(draftId)
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST.value(), "User draft not found!"));
        User user = draft.getUser();
        if (user == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "User associated with this draft does not exist!");
        }
        if (draft.getStatus() != UserDraftStatus.PENDING) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Draft status is not pending!");
        }
        if (reason.isEmpty()){
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Must provide reason");
        }else{
            draft.setRejectMessage(reason);
        }
        draft.setStatus(UserDraftStatus.REJECTED);
        draft.setDeleted(true);
        userDraftRepository.save(draft);
        if (userHasValidInfo(user)) {
            user.setStatus(UserStatus.ACTIVE);
        }
        userRepository.save(user);
        emailService.sendEmail(user.getEmail(), "Profile Update Rejected",
                "Your profile update has been rejected. Reason: " + reason);
    }

    private boolean userHasValidInfo(User user) {
        return user.getName() != null && !user.getName().isBlank()
                && user.getNationalId() != null && !user.getNationalId().isBlank()
                && user.getPhone() != null && !user.getPhone().isBlank()
                && user.getDob() != null
                && user.getAddressDetail() != null && !user.getAddressDetail().isBlank()
                && user.getProvince() != null
                && user.getDistrict() != null
                && user.getWard() != null;
    }





    @Override
    public CarRequestDetailResponse getCarRequestDetailAdmin(int draftId) throws ApiException {
        CarDraft carDraft = carDraftRepository.findCarDraftById(draftId);
        List<CarImagesDTO> carImagesDTOList = new ArrayList<>();
        for (CarImages carImage : carDraft.getCarImages()) {
            carImagesDTOList.add(new CarImagesDTO(carImage.getId(), carImage.getImageUrl(), carImage.getType()));
        }
        List<CarFunctionInfo> carFunctionInfos = carDraft.getCarFunctions().stream().map(carFunction -> carFunction.getCarFunctionInfo()).toList();
        Double lateFee = carTermOfUseRepository.findLateFeeByCarDraft(carDraft.getId()) == null ? 0 : carTermOfUseRepository.findLateFeeByCarDraft(carDraft.getId()).getValue();
        return CarRequestDetailResponse.builder()
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
                .provinceName((carDraft.getProvince() != null) ? carDraft.getProvince().getName() : null)
                .districtName((carDraft.getDistrict() != null) ? carDraft.getDistrict().getName() : null)
                .wardName((carDraft.getWard() != null) ? carDraft.getWard().getName() : null)
                .carModel(new CarModelDTO(carDraft.getCarModel().getId(), carDraft.getCarModel().getName()))
                .carBrand(new CarBrandDTO(carDraft.getCarModel().getBrand().getId(), carDraft.getCarModel().getBrand().getName()))
                .carType(carDraft.getCarType())
                .carTermOfUses(carDraft.getCarTermOfUses().stream().map(x -> x.getTerm()).toList())
                .carImages(carImagesDTOList)
                .carFunctions(carFunctionInfos)
                .lateFee(lateFee)
                .build();
    }
    @Transactional(rollbackFor = ApiException.class)
    @Override
    public void createVoucherByAdmin(AdminVoucherRequest request, MultipartFile systemImg) throws ApiException, IOException {
        Voucher voucher = new Voucher();
        voucher.setType(VoucherType.ADMIN_VOUCHER);
        voucher.setScope(VoucherScope.valueOf(request.getScope().toUpperCase()));
        voucher.setName(request.getName());
        voucher.setDescription(request.getDescription());
        if(request.getBrandId() != 0){
            voucher.setBrand(findCarBrandById(request.getBrandId()));
        }
        List<CarModel> listCarModel = carModelRepository.findByIdIn(request.getListModelId());
        voucher.setModels(listCarModel);
        voucher.setStartDate(request.getStartDate());
        voucher.setEndDate(request.getEndDate());
        voucher.setQuantity(request.getQuantity());
        voucher.setPercentRate(request.getPercentRate());
        voucher.setMaxPrice(request.getMaxPrice());
        if(util.isVoucherCodeExisted(request.getCode())) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY.value(), "Voucher code already exists!");
        }
        voucher.setCode(request.getCode());
        voucher.setFixedPrice(request.getFixedPrice());
        voucher.setStatus(VoucherStatus.INACTIVE);
        voucher.setHomepageDisplay(false);
        Voucher savedVoucher = voucherRepository.save(voucher);
        if (systemImg != null && carServiceImpl.validateFile(systemImg, true)) {
            String imagePath = carServiceImpl.uploadImage(systemImg);
            //update data
            SystemImage systemImage = SystemImage.builder()
                    .imageUrl(imagePath)
                    .type(SystemImageType.VOUCHER_IMAGE)
                    .voucher(savedVoucher)
                    .build();
            systemImageRepository.save(systemImage);
        }

    }
    @Transactional(rollbackFor = ApiException.class)
    @Override
    public void editVoucherByAdmin(int voucherId, AdminVoucherEditRequest request, MultipartFile systemImg) throws ApiException, IOException {
        Voucher editVoucher = carOwnerServiceImpl.findVoucherById(voucherId);
        editVoucher.setScope(VoucherScope.valueOf(request.getScope().toUpperCase()));
        editVoucher.setName(request.getName());
        editVoucher.setDescription(request.getDescription());
        if(request.getBrandId() != 0){
            editVoucher.setBrand(findCarBrandById(request.getBrandId()));
        }else editVoucher.setBrand(null);
        List<CarModel> listCarModel = carModelRepository.findByIdIn(request.getListModelId());
        editVoucher.setModels(listCarModel);
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
        editVoucher.setHomepageDisplay(false);
        voucherRepository.save(editVoucher);
        if(systemImg != null){
            SystemImage oldSystemImages = systemImageRepository.findByVoucherId(voucherId);
            String imgUrl = oldSystemImages.getImageUrl();
            carServiceImpl.deleteFileByUrl(imgUrl);
            systemImageRepository.delete(oldSystemImages);
            if (carServiceImpl.validateFile(systemImg, false)) {
                String imagePath = carServiceImpl.uploadImage(systemImg);
                //update data
                SystemImage systemImage = SystemImage.builder()
                        .imageUrl(imagePath)
                        .type(SystemImageType.VOUCHER_IMAGE)
                        .voucher(editVoucher)
                        .build();
                systemImageRepository.save(systemImage);
            }
        }

    }

    public CarBrand findCarBrandById(int brandId) throws ApiException {
        return carBrandRepository.findById(brandId).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "brand not found"));
    }

    public CarModel findCarModelById(int modelId) throws ApiException {
        CarModel carModel = carModelRepository.findById(modelId);
        if(carModel == null){ throw new ApiException(HttpStatus.NOT_FOUND.value(), "model not found"); }
        return carModel;
    }

    @Override
    public UserDraftPageResponse getDraftList(UserDraftStatus status, Integer page, String sort, String search) throws ApiException {
        int pageNumber = (page != null && page > 0) ? page - 1 : 0;
        int pageSize = 10;

        Sort.Direction direction = "asc".equalsIgnoreCase(sort) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(direction, "createdAt"));

        Page<UserDraft> userDrafts;

        if (status != null && search != null && !search.isBlank()) {
            userDrafts = userDraftRepository.findByStatusAndSearch(status, search.trim(), pageable);
        } else if (status != null) {
            userDrafts = userDraftRepository.findByStatus(status, pageable);
        } else if (search != null && !search.isBlank()) {
            userDrafts = userDraftRepository.findBySearch(search.trim(), pageable);
        } else {
            userDrafts = userDraftRepository.findAll(pageable);
        }

        if (userDrafts.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "No drafts found");
        }

        AtomicInteger index = new AtomicInteger((page - 1) * pageSize + 1);

        List<Map<String, Object>> draftList = userDrafts.map(draft -> {
            Map<String, Object> data = new HashMap<>();
            data.put("index", index.getAndIncrement());
            data.put("draftId", draft.getId());
            data.put("userId", draft.getUser().getId());
            data.put("email", draft.getUser().getEmail());
            data.put("createdAt", formatDate(draft.getCreatedAt()));
            data.put("updatedAt", formatDate(draft.getUpdatedAt()));
            data.put("draftStatus", draft.getStatus());
            return data;
        }).getContent();

        return new UserDraftPageResponse(
                userDrafts.getTotalPages(),
                userDrafts.getNumber() + 1,
                userDrafts.getSize(),
                draftList,
                userDraftRepository.count(),
                userDraftRepository.countByStatus(UserDraftStatus.PENDING),
                userDraftRepository.countByStatus(UserDraftStatus.ACCEPTED),
                userDraftRepository.countByStatus(UserDraftStatus.REJECTED)
        );
    }




    private String formatDate(LocalDateTime dateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        return dateTime != null ? dateTime.format(formatter) : "N/A";
    }

    @Transactional
    @Override
    public void updateUser(int userId, AddUserRequestDTO requestDTO) throws ApiException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST.value(), "User not found"));

        if (!user.getEmail().equals(requestDTO.getEmail())) {
            if (!Pattern.matches("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", requestDTO.getEmail())) {
                throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Invalid email format.");
            }
            if (userRepository.existsByEmail(requestDTO.getEmail())) {
                throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Email already existed. Please try another email");
            }
            user.setEmail(requestDTO.getEmail());
        }

        List<Role> currentRoles = user.getRoles();
        List<Role> newRoles = roleRepository.findAllById(requestDTO.getRoleIds());

        if (newRoles.size() != requestDTO.getRoleIds().size()) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "One or more roles not found");
        }

        boolean hadDriverBefore = currentRoles.stream().
                anyMatch(role -> role.getName().equalsIgnoreCase("Driver"));
        boolean hasDriverNow = newRoles.stream()
                .anyMatch(role -> role.getName().equalsIgnoreCase("DRIVER"));

        if (!hadDriverBefore && hasDriverNow) {
            user.setStatus(UserStatus.INACTIVE);
        }

        if (hadDriverBefore && !hasDriverNow && user.getStatus() == UserStatus.INACTIVE && userHasValidInfo(user)) {
            user.setStatus(UserStatus.ACTIVE);
        }
        currentRoles.removeIf(role -> !newRoles.contains(role));

        newRoles.forEach(role -> {
            if (!currentRoles.contains(role)) {
                currentRoles.add(role);
            }
        });

        user.setRoles(currentRoles);
        userRepository.save(user);
        emailService.sendEmail(
                user.getEmail(),
                "Your account has been updated",
                "<p>Your new email to login: " + user.getEmail() + "</p>" +
                        "<p>Your current roles: " + newRoles.stream().map(Role::getName).collect(Collectors.joining(", ")) + "</p>"
        );
    }



    @Override
    @Transactional(rollbackFor = ApiException.class)
    public String addUser(AddUserRequestDTO requestDTO) throws ApiException {
        String email = requestDTO.getEmail();
        String password = requestDTO.getPassword();
        List<Integer> roleIds = requestDTO.getRoleIds();

        if (!Pattern.matches("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", email)) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Email is invalid format. Please try again");
        }

        if (userRepository.existsByEmail(email)) {
            System.out.println("true");
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Email already existed. Please try another email");
        }

        if (!Pattern.matches("^(?=.*[A-Z])(?=.*[\\W_]).{6,}$", password)) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Password must contain at least one uppercase letter, one numeral, and at least six characters");
        }

        System.out.println("false");

        User newUser = new User();
        newUser.setEmail(email);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setStatus(UserStatus.NOT_ACTIVE);

        List<Role> roles = new ArrayList<>();
        for (Integer roleId : roleIds) {
            Role role = roleRepository.findById(roleId)
                    .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST.value(), "Role with id " + roleId + " not found"));
            roles.add(role);
        }
        newUser.setRoles(roles);

        String token = jwtService.createActiveToken(newUser.getEmail());
        newUser.setActiveToken(token);

        userRepository.save(newUser);

        UserImages avatar = new UserImages();
        avatar.setImageUrl("http://localhost:8080/uploads/defaultAvatar.png");
        avatar.setType(UserImageType.AVATAR);
        avatar.setUser(newUser);
        userImagesRepository.save(avatar);

        emailService.sendEmail(
                newUser.getEmail(),
                "Welcome to Rental Car!",
                "<h1>Thank you for registering!</h1>" +
                        "<p>Your account has been created by admin.</p>" +
                        "<p>Please click the link below to activate your account:</p>" +
                        "<a href='" + "http://localhost:5173/active?token=" + token + "'>Activate your account</a>"
        );

        return "User created successfully and is not active yet.";
    }

    @Override
    public UserDetailResponse getUserDetail(int id) throws ApiException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST.value(), "User with id " + id + " not found"));
        UserDraft userDraft = userDraftRepository
                .findFirstByUserIdAndStatus(user.getId(), UserDraftStatus.PENDING)
                .orElse(null);

        return UserDetailResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .phone(user.getPhone())
                .dob(user.getDob())
                .email(user.getEmail())
                .nationalId(user.getNationalId())
                .provinceName(user.getProvince() != null ? user.getProvince().getCode() : null)
                .districtName(user.getDistrict() != null ? user.getDistrict().getCode() : null)
                .wardName(user.getWard() != null ? user.getWard().getCode() : null)
                .addressDetail(user.getAddressDetail())
                .roles(user.getRoles() != null ?
                        user.getRoles().stream().map(Role::getName).collect(Collectors.toList()) : null)
                .walletBalance(user.getWallet() != null ? user.getWallet().getBalance() : null)
                .status(user.getStatus() != null ? user.getStatus().name() : null)
                .avatarUrl(userImagesRepository.findAvatarByUserId(user.getId()) != null ?
                        userImagesRepository.findAvatarByUserId(user.getId()).getImageUrl() : null)
                .drivingLicenseUrl(getImagesUrl(userImagesRepository.findDrivingLicenseByUserId(user.getId())))
                .banStatus(user.isBan())
                .banDuration(user.getBanDuration())
                .price(user.getPrice())
                .lateFee(user.getLateFee())
                .driverExp(user.getDriverExp())
                .draftStatus(userDraft != null ? userDraft.getStatus().name() : null) // Nếu userDraft null thì draftStatus = null
                .build();
    }
    @Override
    public void activateVoucherHomepageDisplay(int voucherId) throws ApiException {
        Voucher voucher = carOwnerServiceImpl.findVoucherById(voucherId);
        voucher.setHomepageDisplay(true);
        voucherRepository.save(voucher);
    }

    @Override
    public void deactivateVoucherHomepageDisplay(int voucherId) throws ApiException {
        Voucher voucher = carOwnerServiceImpl.findVoucherById(voucherId);
        voucher.setHomepageDisplay(false);
        voucherRepository.save(voucher);
    }



    public List<String> getImagesUrl(List<UserImages> userImages) {
        return userImages.stream()
                .map(UserImages::getImageUrl)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserRoleResponse> getAllUserRoles() throws ApiException {
        try {
            return roleRepository.findAllRoleResponses();
        } catch (Exception e) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Failed to fetch user roles");
        }
    }

    @Override
    public AdminDashboardResponse getAdminDashboard(Date startWeekDate, Date endWeekDate, Date startMonthDate, Date endMonthdate) throws ApiException {
        List<User> listOfUsers = userRepository.getAllUsers();
        int sumOfUsers = listOfUsers.size();
        int numberOfDriver = userRepository.getUsersByRole("driver").size();
        int numberOfCarOwner = userRepository.getUsersByRole("carOwner").size();
        int numberOfCustomer = userRepository.getUsersByRole("user").size();
        List<PieChartResponse> pieChartResponses = new ArrayList<>();
        pieChartResponses.add(new PieChartResponse("driver",numberOfDriver));
        pieChartResponses.add(new PieChartResponse("carOwner",numberOfCarOwner));
        pieChartResponses.add(new PieChartResponse("customer",numberOfCustomer));

        Wallet adminWallet = getAdminWallet();
        Double balance = adminWallet.getBalance();

        List<Booking> listOfBooking = bookingRepository.getAllDoneBookings();

        int numberOfBookingInWeek = listOfBooking.stream()
                .filter(booking -> !booking.getStartDate().before(startWeekDate)&& !booking.getStartDate().after(endWeekDate))
                .toList()
                .size();
        int numberOfBookingInMonth = listOfBooking.stream()
                .filter(booking -> !booking.getStartDate().before(startMonthDate)&& !booking.getStartDate().after(endMonthdate))
                .toList()
                .size();


        List<WalletHistory> adminWalletHistory = adminWallet.getHistory();
        List<DashboardBookingDTO> listBookings = adminWalletHistory.stream()
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

        List<ChartResponse> barChartResponse = walletHistoryRepository.findByDataForAdminIncomeBarCharByMonth();


        return AdminDashboardResponse.builder()
                .userPieChart(pieChartResponses)
                .sumOfUser(sumOfUsers)
                .balanceInWallet(balance)
                .numberOfBookingInWeek(numberOfBookingInWeek)
                .numberOfBookingInMonth(numberOfBookingInMonth)
                .listOfBookings(listBookings)
                .barChartIncomeByMonth(barChartResponse)
                .build();
    }

    public Wallet getAdminWallet() throws ApiException {
        Wallet adminWallet = walletRepository.findByWalletType(UserWalletType.ADMIN_WALLET);
        if (adminWallet == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Admin wallet not found");
        }
        return adminWallet;
    }


}
