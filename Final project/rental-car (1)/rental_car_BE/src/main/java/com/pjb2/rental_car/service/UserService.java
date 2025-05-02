package com.pjb2.rental_car.service;

import com.pjb2.rental_car.dto.request.ChangePasswordDTO;
import com.pjb2.rental_car.dto.request.DriverUpdateRequest;
import com.pjb2.rental_car.dto.request.UserRequestDTO;
import com.pjb2.rental_car.dto.response.DriverDetailRespone;
import com.pjb2.rental_car.dto.response.UserDetailResponse;
import com.pjb2.rental_car.entity.User;
import com.pjb2.rental_car.exception.ApiException;
import com.pjb2.rental_car.util.common.UserImageType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface UserService {
    void updateUser(String token, UserRequestDTO request) throws ApiException;
    UserDetailResponse getUser(String token) throws ApiException;
    String uploadImage(MultipartFile file, String token, UserImageType type) throws IOException, ApiException;
    List<String> uploadMultipleImages(MultipartFile[] files, String token, UserImageType type) throws IOException, ApiException;
    void changePassword(String token, ChangePasswordDTO request) throws ApiException;
    DriverDetailRespone getDriverDetail(String token) throws ApiException;
    void updateDriverDetail(String token, DriverUpdateRequest request) throws ApiException;
    void updateUserProfileDraft(String token, UserRequestDTO request, MultipartFile[] files) throws IOException, ApiException;
    UserDetailResponse getDraftDetail(int draftId) throws ApiException;
    UserDetailResponse getDraftDetail(String token) throws ApiException;
}
