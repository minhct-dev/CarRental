package com.pjb2.rental_car.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pjb2.rental_car.dto.request.ChangePasswordDTO;
import com.pjb2.rental_car.dto.request.DriverUpdateRequest;
import com.pjb2.rental_car.dto.request.UserRequestDTO;
import com.pjb2.rental_car.dto.response.DriverDetailRespone;
import com.pjb2.rental_car.dto.response.CarOwnerDetailResponse;
import com.pjb2.rental_car.dto.response.ResponseSuccess;
import com.pjb2.rental_car.dto.response.UserDetailResponse;
import com.pjb2.rental_car.exception.ApiException;
import com.pjb2.rental_car.service.CarOwnerService;
import com.pjb2.rental_car.service.UserService;
import com.pjb2.rental_car.util.Util;
import com.pjb2.rental_car.util.common.UserImageType;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Valid;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor

public class UserController {
    @Autowired
    private final UserService userService;
    @Autowired
    private final CarOwnerService carOwnerService;
    @Autowired
    Util util;

    @PreAuthorize("hasAuthority('user')")
    @Operation(summary = "View user profile", description = "Get profile details of the authenticated user")
    @GetMapping("/profile")
    public ResponseSuccess<UserDetailResponse> getUser(@RequestHeader("Authorization") String token) throws ApiException {
        try {
            UserDetailResponse userDetailResponse = userService.getUser(token);
            return new ResponseSuccess<>(200, "Success", userDetailResponse);
        }catch (Exception e){
            if(e instanceof ApiException){
                throw e;
            }else throw new RuntimeException(e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('user')")
    @Operation(summary = "Update user profile", description = "Update profile details of the authenticated user")
    @PutMapping("/profile")
    public ResponseSuccess<Void> updateUser(@RequestHeader("Authorization") String token, @Valid @RequestBody UserRequestDTO request) throws ApiException {
        try {
            userService.updateUser(token, request);
            return new ResponseSuccess<>(HttpStatus.ACCEPTED.value(), "Success", null);
        }catch (Exception e){
            if(e instanceof ApiException){
                throw e;
            }else throw new RuntimeException(e.getMessage());
        }

    }

    @PreAuthorize("hasAuthority('user')")
    @Operation(summary = "Change password", description = "Change the password of the authenticated user")
    @PutMapping("/change-password")
    public ResponseSuccess<Void> changePassword(@RequestHeader("Authorization") String token,
                                                @RequestBody ChangePasswordDTO request) throws ApiException {
        try {
            userService.changePassword(token, request);
            return new ResponseSuccess<>(HttpStatus.ACCEPTED.value(), "Password changed successfully", null);
        }catch (Exception e){
            if(e instanceof ApiException){
                throw e;
            }else throw new RuntimeException(e.getMessage());
        }

    }

    @PreAuthorize("hasAuthority('user')")
    @PutMapping("/avatar")
    public ResponseSuccess<String> updateAvatar(@RequestHeader("Authorization") String token, @RequestParam("file") MultipartFile file) throws ApiException, IOException {
        try {
            String fileUrl = userService.uploadImage(file, token, UserImageType.AVATAR);
            return new ResponseSuccess<>(HttpStatus.OK.value(), "Avatar updated successfully", fileUrl);
        }catch (Exception e){
            if(e instanceof ApiException){
                throw e;
            }else throw new RuntimeException(e.getMessage());
        }

    }

    @PreAuthorize("hasAuthority('user')")
    @PutMapping("/driving-license")
    public ResponseSuccess<List<String>> updateDrivingLicense(@RequestHeader("Authorization") String token, @RequestParam("files") MultipartFile[] files) throws ApiException, IOException {
        try {
            if (files.length != 2) {
                throw new ApiException(HttpStatus.BAD_REQUEST.value(), "You must upload exactly two images for the driving license");
            }
            List<String> fileUrls = userService.uploadMultipleImages(files, token, UserImageType.LICENSE_DRIVER);
            return new ResponseSuccess<>(HttpStatus.OK.value(), "Driving license updated successfully", fileUrls);
        }catch (Exception e){
            if(e instanceof ApiException){
                throw e;
            }else throw new RuntimeException(e.getMessage());
        }

    }

    //AnhCP2
    @Operation(summary = "View car owner profile", description = "Get profile details of a car owner")
    @GetMapping("/car-owner-profile/{ownerId}")
    public ResponseSuccess<CarOwnerDetailResponse> getCarOwnerProfile(
            @PathVariable("ownerId") int ownerId,
            @RequestParam(name = "carPage", defaultValue = "1") int carPage,
            @RequestParam(name = "feedbackPage", defaultValue = "1") int feedbackPage
    ) throws ApiException {
        try {
            if (carPage <= 0) carPage = 1;
            if (feedbackPage <= 0) feedbackPage = 1;

            CarOwnerDetailResponse response = carOwnerService.getCarOwnerDetail(ownerId, carPage , feedbackPage );
            return new ResponseSuccess<>(200, "Success", response);
        }catch (Exception e){
            if(e instanceof ApiException){
                throw e;
            }else throw new RuntimeException(e.getMessage());
        }



    }



    @GetMapping("/driver-detail")
    public ResponseSuccess<DriverDetailRespone> getDriverDetail(@RequestHeader("Authorization") String token) throws ApiException {
        try{
            DriverDetailRespone driverDetailRespone = userService.getDriverDetail(token);
            return new ResponseSuccess<>(HttpStatus.OK.value(),"Get driver detail successfully",driverDetailRespone);
        }catch (Exception e){
            if(e instanceof ApiException){
                throw e;
            }else throw new RuntimeException(e.getMessage());
        }

    }
    @PatchMapping("/update-driver-detail")
    public ResponseSuccess updateDriverDetail(@RequestHeader("Authorization") String token,@Valid @RequestBody DriverUpdateRequest request) throws ApiException {
        try{
            userService.updateDriverDetail(token,request);
            return new ResponseSuccess<>(HttpStatus.ACCEPTED.value(), "Driver detail updated successfully", null);
        }catch (Exception e){
            if(e instanceof ApiException){
                throw e;
            }else throw new RuntimeException(e.getMessage());
        }

    }

    @PreAuthorize("hasAuthority('user')")
    @Operation(summary = "Update user profile draft", description = "Update profile details and upload driving license images")
    @PatchMapping(value = "/profile-draft", consumes = "multipart/form-data")
    public ResponseSuccess<Void> updateUserProfileDraft(
            @RequestHeader("Authorization") String token,
            @RequestParam(value = "files", required = false) List<MultipartFile> files,
            @RequestPart(value = "obj", required = false) String obj) throws IOException, ApiException {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            UserRequestDTO request = (obj != null && !obj.trim().isEmpty())
                    ? objectMapper.readValue(obj, UserRequestDTO.class)
                    : null;
            files = (files != null) ? files : new ArrayList<>();
            if (request != null) {
                Validator validator = Validation.buildDefaultValidatorFactory().getValidator();
                Set<ConstraintViolation<UserRequestDTO>> violations = validator.validate(request);
                if (!violations.isEmpty()) {
                    throw new ApiException(HttpStatus.BAD_REQUEST.value(), violations.iterator().next().getMessage());
                }
            }
            userService.updateUserProfileDraft(token, request, files.toArray(new MultipartFile[0]));
            return new ResponseSuccess<>(HttpStatus.ACCEPTED.value(), "Profile update request has been sent and wait to be approved", null);
        }catch (Exception e){
            if(e instanceof ApiException){
                throw e;
            }else throw new RuntimeException(e.getMessage());
        }

    }

    @PreAuthorize("hasAuthority('user')")
    @Operation(summary = "View draft profile", description = "Get the latest draft profile of the authenticated user")
    @GetMapping("/profile-draft")
    public ResponseSuccess<UserDetailResponse> getDraftDetail(@RequestHeader("Authorization") String token) throws ApiException {
        try {
            UserDetailResponse draftDetail = userService.getDraftDetail(token);
            return new ResponseSuccess<>(HttpStatus.OK.value(), "Success", draftDetail);
        }catch (Exception e){
            if(e instanceof ApiException){
                throw e;
            }else throw new RuntimeException(e.getMessage());
        }

    }

}
