package com.pjb2.rental_car.service;

import com.pjb2.rental_car.dto.request.*;
import com.pjb2.rental_car.dto.response.*;
import com.pjb2.rental_car.entity.CarDraft;
import com.pjb2.rental_car.exception.ApiException;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.pjb2.rental_car.exception.ApiException;
import com.pjb2.rental_car.util.common.UserDraftStatus;
import com.pjb2.rental_car.util.common.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface AdminService {
    //Admin service
    CarRequestPageResponse getListCarRequest(String sort, int page, int size, String status, String type) throws ApiException;
    void addCarRequestAccept(int draftId) throws ApiException;
    Page<UserDetailResponse> listAllUsers(int page);
    Page<UserDetailResponse> searchUsers(
            String name, String email, Integer roleId, UserStatus status, Boolean isBan, Integer page, String sort);
    void sendEmailToUser(int userId, String subject, String content) throws ApiException;
    void addCarRequestReject(int draftId , String message) throws ApiException;
    CarDraftResponse getCarRequestDetail(int draftId) throws ApiException;
    void banUser(int userId, int days, String reason) throws ApiException;
    void unbanUser(int userId) throws ApiException;
    public boolean checkBanStatus(int userId) throws ApiException;
    String formatDuration(long totalHours);
    void approveUserDraft(int draftId) throws ApiException;
    void rejectUserDraft(int draftId, String reason) throws ApiException;

    void updateCarRequestAccept(int draftId) throws ApiException;
    void updateCarRequestReject(int draftId,String message) throws ApiException;
    CarRequestDetailResponse getCarRequestDetailAdmin(int draftId) throws ApiException;
    void createVoucherByAdmin(AdminVoucherRequest request, MultipartFile systemImg) throws ApiException, IOException;
    void editVoucherByAdmin(int voucherId,AdminVoucherEditRequest request, MultipartFile systemImg) throws ApiException, IOException;
    UserDraftPageResponse getDraftList(UserDraftStatus status, Integer page, String sort, String search) throws ApiException;
    void updateUser(int userId, AddUserRequestDTO requestDTO) throws ApiException;
    String addUser(AddUserRequestDTO requestDTO) throws ApiException;
    UserDetailResponse getUserDetail(int userId) throws ApiException;
    void activateVoucherHomepageDisplay(int voucherId) throws ApiException;
    void deactivateVoucherHomepageDisplay(int voucherId) throws ApiException;
    List<UserRoleResponse> getAllUserRoles() throws ApiException;
    AdminDashboardResponse getAdminDashboard(Date startWeekDate, Date endWeekDate, Date startMonthDate, Date endMonthdate) throws ApiException;
}
