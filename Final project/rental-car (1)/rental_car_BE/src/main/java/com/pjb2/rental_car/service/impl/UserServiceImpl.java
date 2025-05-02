package com.pjb2.rental_car.service.impl;

import com.pjb2.rental_car.dto.request.ChangePasswordDTO;
import com.pjb2.rental_car.dto.request.DriverUpdateRequest;
import com.pjb2.rental_car.dto.request.UserRequestDTO;
import com.pjb2.rental_car.dto.response.DriverDetailRespone;
import com.pjb2.rental_car.dto.response.UserDetailResponse;
import com.pjb2.rental_car.entity.*;
import com.pjb2.rental_car.exception.ApiException;
import com.pjb2.rental_car.repository.*;
import com.pjb2.rental_car.service.UserService;
import com.pjb2.rental_car.util.JwtService;
import com.pjb2.rental_car.util.Util;
import com.pjb2.rental_car.util.common.UserDraftStatus;
import com.pjb2.rental_car.util.common.UserImageType;
import com.pjb2.rental_car.util.common.UserStatus;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final ProvinceRepository provinceRepository;
    private final DistrictRepository districtRepository;
    private final WardRepository wardRepository;
    private final UserImagesRepository userImagesRepository;
    private final Util util;
    private final JwtService jwtService;
    private final UserDraftRepository userDraftRepository;


    private User getUserByToken(String token) throws ApiException {
        String email = jwtService.getEmailFromToken(token);
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ApiException(HttpStatus.NOT_FOUND.value(), "User not found");
        }
        return user;
    }

    /**
     * Cập nhật thông tin User
     */
    @Override
    public void updateUser(String token, UserRequestDTO request) throws ApiException {
        User user = getUserByToken(token);
        if (request.getProvinceCode() != null) {
            Province province = provinceRepository.findById(request.getProvinceCode())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "Province not found"));
            user.setProvince(province);
        }

        if (request.getDistrictCode() != null) {
            District district = districtRepository.findById(request.getDistrictCode())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "District not found"));

            if (user.getProvince() != null && !district.getProvince().getCode().equals(user.getProvince().getCode())) {
                throw new ApiException(HttpStatus.BAD_REQUEST.value(), "District does not belong to the given Province");
            }
            user.setDistrict(district);
        }

        if (request.getWardCode() != null) {
            Ward ward = wardRepository.findById(request.getWardCode())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "Ward not found"));

            if (user.getDistrict() != null && !ward.getDistrict().getCode().equals(user.getDistrict().getCode())) {
                throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Ward does not belong to the given District");
            }
            user.setWard(ward);
        }

        if (request.getName() != null) user.setName(request.getName());
        if (request.getPhone() != null && !request.getPhone().equals(user.getPhone())) {
            boolean existsPhone = userRepository.existsByPhone(request.getPhone());
            if (existsPhone) {
                throw new ApiException(HttpStatus.CONFLICT.value(), "Phone number already exists.");
            }
            user.setPhone(request.getPhone());
        }
        if (request.getNationalId() != null && !request.getNationalId().equals(user.getNationalId())) {
            boolean existsNationalId = userRepository.existsByNationalId(request.getNationalId());
            if (existsNationalId) {
                throw new ApiException(HttpStatus.CONFLICT.value(), "National ID already exists.");
            }
            user.setNationalId(request.getNationalId());
        }
        if (request.getAddressDetail() != null) user.setAddressDetail(request.getAddressDetail());
        if (request.getDob() != null) user.setDob(request.getDob());

        userRepository.save(user);
        log.info("User updated successfully!");
    }

    @Override
    public void changePassword(String token, ChangePasswordDTO request) throws ApiException {
        User user = getUserByToken(token);
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        if (request.getCurrentPassword() == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Current password cannot be blank.");
        }
        if (!encoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Current password is incorrect.");
        }
        if (request.getNewPassword() == null || request.getConfirmPassword() == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "New password and confirm password cannot be blank.");
        }
        if (request.getNewPassword().equals(request.getCurrentPassword())) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "New password must be different from the current password.");
        }
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "New password and Confirm password don’t match.");
        }

        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("User password updated successfully!");
    }

    @Override
    public DriverDetailRespone getDriverDetail(String token) throws ApiException {
        User driver = getUserByToken(token);
        return DriverDetailRespone.builder()
                .driver_exp(driver.getDriverExp())
                .late_fee(driver.getLateFee())
                .price(driver.getPrice())
                .build();
    }
    @Transactional(rollbackOn = ApiException.class)
    @Override
    public void updateDriverDetail(String token, DriverUpdateRequest request) throws ApiException {
        User driver = getUserByToken(token);
        driver.setLateFee(request.getLate_fee());
        driver.setPrice(request.getPrice());
        driver.setDriverExp(request.getDriver_exp());
        driver.setStatus(UserStatus.ACTIVE);
        userRepository.save(driver);
    }


    /**
     * Lấy thông tin user
     */
    @Override
    public UserDetailResponse getUser(String token) throws ApiException {
        User user = getUserByToken(token);
        UserDraft userDraft = userDraftRepository
                .findTopByUserIdOrderByIdDesc(user.getId())
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
                .description(user.getDescription() )
                .draftId(userDraft != null ? userDraft.getId() : 0)
                .draftStatus(userDraft != null ? userDraft.getStatus().name() : null)
                .draftRejectMessage(userDraft != null ? userDraft.getRejectMessage() : null)
                .build();
    }


    /**
     * Lấy danh sách ảnh của user
     */
    public List<String> getImagesUrl(List<UserImages> userImages) {
        return userImages.stream()
                .map(UserImages::getImageUrl)
                .collect(Collectors.toList());
    }

    /**
     * Upload hình ảnh (Avatar, Giấy phép lái xe)
     */
    @Override
    @Transactional
    public String uploadImage(MultipartFile file, String token, UserImageType type) throws IOException, ApiException {
        validateFile(file);

        String fileUrl = util.uploadImage(file);

        User user = getUserByToken(token);

        if (type == UserImageType.AVATAR) {
            userImagesRepository.deleteByUserIdAndType(user.getId(), UserImageType.AVATAR);
        }

        UserImages userImage = new UserImages();
        userImage.setUser(user);
        userImage.setImageUrl(fileUrl);
        userImage.setType(type);
        userImagesRepository.save(userImage);
        return fileUrl;
    }

    /**
     * Kiểm tra file upload có hợp lệ không
     */
    private void validateFile(MultipartFile file) throws ApiException {
        List<String> allowedTypes = Arrays.asList("image/jpeg", "image/png", "image/jpg");

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "File too large");
        }
        if (!allowedTypes.contains(file.getContentType())) {
            throw new ApiException(HttpStatus.UNSUPPORTED_MEDIA_TYPE.value(), "Invalid file type");
        }
    }

    @Transactional
    @Override
    public List<String> uploadMultipleImages(MultipartFile[] files, String token, UserImageType type) throws IOException, ApiException {
        for (MultipartFile file : files) {
            validateFile(file);
        }

        User user = getUserByToken(token);

        if (type == UserImageType.LICENSE_DRIVER) {
            userImagesRepository.deleteByUserIdAndType(user.getId(), UserImageType.LICENSE_DRIVER);
        }

        List<String> fileUrls = Arrays.stream(files)
                .map(file -> {
                    try {
                        return util.uploadImage(file);
                    } catch (IOException e) {
                        throw new RuntimeException("Error uploading file", e);
                    }
                })
                .collect(Collectors.toList());

        List<UserImages> userImages = fileUrls.stream().map(url -> {
            UserImages userImage = new UserImages();
            userImage.setUser(user);
            userImage.setImageUrl(url);
            userImage.setType(type);
            return userImage;
        }).collect(Collectors.toList());

        userImagesRepository.saveAll(userImages);
        return fileUrls;
    }

    @Transactional
    @Override
    public void updateUserProfileDraft(String token, UserRequestDTO request, MultipartFile[] files) throws IOException, ApiException {
        User user = getUserByToken(token);
        boolean isDriver = user.getRoles().stream().anyMatch(role -> role.getName().equalsIgnoreCase("DRIVER"));
        boolean isCarOwner = user.getRoles().stream().anyMatch(role -> role.getName().equalsIgnoreCase("CAROWNER"));
        files = (files != null) ? files : new MultipartFile[0];
        if (isDriver) {
            boolean hasNoLicenseImages = userImagesRepository
                    .findAllByUserIdAndType(user.getId(), UserImageType.LICENSE_DRIVER)
                    .isEmpty();
            if (hasNoLicenseImages && files.length != 2) {
                throw new ApiException(HttpStatus.BAD_REQUEST.value(), "As a driver, you must upload exactly two driving license images.");
            }
        } else {
            if (files.length != 0 && files.length != 2) {
                throw new ApiException(HttpStatus.BAD_REQUEST.value(), "You must upload exactly two images for the driving license, or none.");
            }
        }
        UserDraft draft = userDraftRepository
                .findFirstByUserIdAndStatus(user.getId(), UserDraftStatus.PENDING)
                .orElseGet(() -> {
                    UserDraft newDraft = new UserDraft();
                    newDraft.setStatus(UserDraftStatus.PENDING);
                    newDraft.setUser(user);
                    return newDraft;
                });

        if (draft.getStatus() != UserDraftStatus.PENDING) {
            draft = new UserDraft();
            draft.setUser(user);
            draft.setStatus(UserDraftStatus.PENDING);
        }
        draft.setName(request.getName() != null ? request.getName() : user.getName());
        if (request.getPhone() != null && !request.getPhone().equals(user.getPhone())) {
            if (userRepository.existsByPhone(request.getPhone())) {
                throw new ApiException(HttpStatus.CONFLICT.value(), "Phone number already exists.");
            }
            draft.setPhone(request.getPhone());
        } else {
            draft.setPhone(user.getPhone());
        }
        if (request.getNationalId() != null && !request.getNationalId().equals(user.getNationalId())) {
            if (userRepository.existsByNationalId(request.getNationalId())) {
                throw new ApiException(HttpStatus.CONFLICT.value(), "National ID already exists.");
            }
            draft.setNationalId(request.getNationalId());
        } else {
            draft.setNationalId(user.getNationalId());
        }

        draft.setAddressDetail(request.getAddressDetail() != null ? request.getAddressDetail() : user.getAddressDetail());
        Date dobDate = request.getDob() != null ? request.getDob() : user.getDob();
        if (dobDate == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Date of birth is required.");
        }
        LocalDate dob = dobDate.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();

        int age = Period.between(dob, LocalDate.now()).getYears();
        if (age < 18) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "You must be at least 18 years old to be a driver or car owner.");
        }

        draft.setDob(request.getDob() != null ? request.getDob() : user.getDob());

        draft.setProvince(
                request.getProvinceCode() != null ?
                        provinceRepository.findById(request.getProvinceCode())
                                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "Province not found")) :
                        user.getProvince()
        );

        draft.setDistrict(
                request.getDistrictCode() != null ?
                        districtRepository.findById(request.getDistrictCode())
                                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "District not found")) :
                        user.getDistrict()
        );

        draft.setWard(
                request.getWardCode() != null ?
                        wardRepository.findById(request.getWardCode())
                                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "Ward not found")) :
                        user.getWard()
        );
        if (draft.getDistrict() != null && draft.getProvince() != null &&
                !draft.getDistrict().getProvince().getCode().equals(draft.getProvince().getCode())) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "District does not belong to the given Province");
        }
        if (draft.getWard() != null && draft.getDistrict() != null &&
                !draft.getWard().getDistrict().getCode().equals(draft.getDistrict().getCode())) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Ward does not belong to the given District");
        }
        draft.setPrice(request.getPrice() != null && request.getPrice() >= 0 ? request.getPrice() : user.getPrice());
        draft.setLateFee(request.getLateFee() != null && request.getLateFee() >= 0 ? request.getLateFee() : user.getLateFee());
        draft.setDriverExp(request.getDriverExp() != null && request.getDriverExp() > 0 ? request.getDriverExp() : user.getDriverExp());
        draft.setDescription(request.getDescription() != null ? request.getDescription() : user.getDescription());
        userDraftRepository.save(draft);
        if (files != null && files.length > 0) {
            for (MultipartFile file : files) {
                validateFile(file);
            }
            List<String> fileUrls = Arrays.stream(files)
                    .map(file -> {
                        try {
                            return util.uploadImage(file);
                        } catch (IOException e) {
                            throw new RuntimeException("Error uploading file", e);
                        }
                    })
                    .collect(Collectors.toList());
            final AtomicReference<UserDraft> finalDraft = new AtomicReference<>(draft);
            List<UserImages> userImages = fileUrls.stream().map(url -> {
                UserImages userImage = new UserImages();
                userImage.setUserDraft(finalDraft.get());
                userImage.setImageUrl(url);
                userImage.setType(UserImageType.LICENSE_DRIVER);
                return userImage;
            }).collect(Collectors.toList());

            List<UserImages> existingLicenseImages = draft.getUserImages() != null ?
                    draft.getUserImages().stream()
                            .filter(img -> img.getType() == UserImageType.LICENSE_DRIVER)
                            .collect(Collectors.toList()) :
                    new ArrayList<>();

            if (!existingLicenseImages.isEmpty()) {
                userImagesRepository.deleteAll(existingLicenseImages);
            }
            userImagesRepository.saveAll(userImages);
        }

        log.info("User profile and images update request saved to draft. Pending admin approval.");
    }



    @Override
    public UserDetailResponse getDraftDetail(int draftId) throws ApiException {

        UserDraft userDraft = userDraftRepository.findById(draftId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "Draft not found"));
        User user = userDraft.getUser();
        List<String> licenseImageUrls = userImagesRepository.findLicenseImagesByDraftId(draftId);

        return UserDetailResponse.builder()
                .id(user.getId())
                .name(userDraft.getName())
                .email(user.getEmail())
                .phone(userDraft.getPhone())
                .dob(userDraft.getDob())
                .nationalId(userDraft.getNationalId())
                .provinceName(userDraft.getProvince() != null ? userDraft.getProvince().getCode() : null)
                .districtName(userDraft.getDistrict() != null ? userDraft.getDistrict().getCode() : null)
                .wardName(userDraft.getWard() != null ? userDraft.getWard().getCode() : null)
                .addressDetail(userDraft.getAddressDetail())
                .roles(user.getRoles() != null ?
                        user.getRoles().stream().map(Role::getName).collect(Collectors.toList()) : null)
                .status(user.getStatus() != null ? user.getStatus().name() : null)
                .avatarUrl(userImagesRepository.findAvatarByUserId(user.getId()) != null ?
                        userImagesRepository.findAvatarByUserId(user.getId()).getImageUrl() : null)
                .drivingLicenseUrl(licenseImageUrls)
                .price(userDraft.getPrice())
                .lateFee(userDraft.getLateFee())
                .driverExp(userDraft.getDriverExp())
                .description(userDraft.getDescription() != null ? userDraft.getDescription() : null)
                .draftStatus(userDraft.getStatus() != null ? userDraft.getStatus().name() : null)
                .build();
    }

    @Override
    public UserDetailResponse getDraftDetail(String token) throws ApiException {
        User user = getUserByToken(token);

        UserDraft userDraft = userDraftRepository
                .findTopByUserIdOrderByIdDesc(user.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "No draft found for user"));

        List<String> licenseImageUrls = userImagesRepository.findLicenseImagesByDraftId(userDraft.getId());

        return UserDetailResponse.builder()
                .id(user.getId())
                .name(userDraft.getName())
                .email(user.getEmail())
                .phone(userDraft.getPhone())
                .dob(userDraft.getDob())
                .nationalId(userDraft.getNationalId())
                .provinceName(userDraft.getProvince() != null ? userDraft.getProvince().getCode() : null)
                .districtName(userDraft.getDistrict() != null ? userDraft.getDistrict().getCode() : null)
                .wardName(userDraft.getWard() != null ? userDraft.getWard().getCode() : null)
                .addressDetail(userDraft.getAddressDetail())
                .roles(user.getRoles() != null ?
                        user.getRoles().stream().map(Role::getName).collect(Collectors.toList()) : null)
                .status(user.getStatus() != null ? user.getStatus().name() : null)
                .avatarUrl(userImagesRepository.findAvatarByUserId(user.getId()) != null ?
                        userImagesRepository.findAvatarByUserId(user.getId()).getImageUrl() : null)
                .drivingLicenseUrl(licenseImageUrls)
                .price(userDraft.getPrice())
                .lateFee(userDraft.getLateFee())
                .driverExp(userDraft.getDriverExp())
                .description(userDraft.getDescription() != null ? userDraft.getDescription() : null)
                .draftStatus(userDraft.getStatus() != null ? userDraft.getStatus().name() : null)
                .build();
    }




}
