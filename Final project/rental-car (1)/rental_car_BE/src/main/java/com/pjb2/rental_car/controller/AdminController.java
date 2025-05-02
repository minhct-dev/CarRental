package com.pjb2.rental_car.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pjb2.rental_car.dto.request.*;
import com.pjb2.rental_car.dto.response.*;
import com.pjb2.rental_car.entity.Ward;
import com.pjb2.rental_car.exception.ApiException;
import com.pjb2.rental_car.service.AdminService;
import com.pjb2.rental_car.service.UserService;
import com.pjb2.rental_car.util.common.UserDraftStatus;
import com.pjb2.rental_car.util.common.UserStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.service.annotation.GetExchange;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/admin")
@Tag(name = "Admin Controller")
@RequiredArgsConstructor
public class AdminController {
    private final UserService userService;
    private final AdminService adminService;

    @Operation(summary = "List all users", description = "Get list of all users")
    @GetMapping("/users")
    public ResponseSuccess<Map<String, Object>> listAllUsers(@RequestParam(defaultValue = "1") int page) {

        try {
            int size = 10;
            Pageable pageable = PageRequest.of(0, size);
            Page<UserDetailResponse> userResults = adminService.listAllUsers(page);
            Map<String, Object> response = new HashMap<>();
            response.put("totalPages", userResults.getTotalPages());
            response.put("currentPage", userResults.getNumber() + 1);
            response.put("pageSize", userResults.getSize());
            response.put("users", userResults.getContent());
            return new ResponseSuccess<>(200, "success", response);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }


    @Operation(summary = "Search users", description = "Search users with filters, pagination, and sorting")
    @GetMapping("/users-search")
    public ResponseSuccess<Map<String, Object>> searchUsers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) Integer roleId,
            @RequestParam(required = false) UserStatus status,
            @RequestParam(required = false) Boolean isBan,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(required = false) String sort) {
        try {
            Page<UserDetailResponse> userResults = adminService.searchUsers(name, email, roleId, status, isBan, page, sort);

            Map<String, Object> response = new HashMap<>();
            response.put("totalPages", userResults.getTotalPages());
            response.put("currentPage", userResults.getNumber() + 1);
            response.put("pageSize", userResults.getSize());
            response.put("users", userResults.getContent());

            return new ResponseSuccess<>(HttpStatus.OK.value(), "success", response);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }




    @Operation(summary = "Send email to user", description = "Admin sends an email to a specific user")
    @PostMapping("/send-email/{userId}")
    public ResponseSuccess<?> sendEmailToUser(
            @PathVariable int userId,
            @RequestParam String subject,
            @RequestParam String content) throws ApiException {
        try {
            adminService.sendEmailToUser(userId, subject, content);
            return new ResponseSuccess<>(HttpStatus.OK.value(), "success",null);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }
    @GetMapping("/get-car-draft-request")
    public ResponseSuccess<CarRequestPageResponse> getListOfRequests(@RequestParam(required = false) String sort,
                                                                     @RequestParam(defaultValue = "0") int page,
                                                                     @RequestParam(defaultValue = "10") int size,
                                                                     @RequestParam(required = false) String status,
                                                                     @RequestParam(required = false) String type) throws ApiException {
        try {
            return new ResponseSuccess<>(HttpStatus.OK.value(),"get list success",adminService.getListCarRequest(sort,page,size,status,type));
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }
    @PostMapping("/accept-car-request")
    public ResponseSuccess acceptCarRequest(@RequestParam int draftId) throws ApiException {
        try {
            adminService.addCarRequestAccept(draftId);
            return new ResponseSuccess<>(HttpStatus.OK.value(), "accept request success",null);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }
    @PutMapping("/reject-car-request")
    public ResponseSuccess rejectCarRequest(@RequestParam int draftId,@RequestParam String message) throws ApiException {
        try {
            adminService.addCarRequestReject(draftId,message);
            return new ResponseSuccess<>(HttpStatus.OK.value(), "reject request success",null);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @Operation(summary = "Ban user", description = "Admin bans a user for a specific number of days with a reason")
    @PostMapping("/ban/{userId}")
    public ResponseSuccess<?> banUser(@PathVariable int userId,
                                      @RequestParam int hours,
                                      @RequestParam String reason) throws ApiException {
        try {
            adminService.banUser(userId, hours, reason);
            return new ResponseSuccess<>(HttpStatus.OK.value(), "User banned successfully", null);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @Operation(summary = "Unban user", description = "Admin unbans a user")
    @PostMapping("/unban/{userId}")
    public ResponseSuccess<?> unbanUser(@PathVariable int userId) throws ApiException {
        try {
            adminService.unbanUser(userId);
            return new ResponseSuccess<>(HttpStatus.OK.value(), "User unbanned successfully", null);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @Operation(summary = "Approve user draft", description = "Admin approves a user draft profile update")
    @PutMapping("/approve-user/{draftId}")
    public ResponseSuccess<?> approveUserDraft(@PathVariable int draftId) throws ApiException {
        try {
            adminService.approveUserDraft(draftId);
            return new ResponseSuccess<>(HttpStatus.OK.value(), "User draft approved successfully", null);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }
    @PutMapping("/accept-update-car-request")
    public ResponseSuccess acceptUpdateCarRequest(@RequestParam int draftId) throws ApiException {
        try {
            adminService.updateCarRequestAccept(draftId);
            return new ResponseSuccess<>(HttpStatus.OK.value(), "accept request success",null);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }
    @PutMapping("/reject-update-car-request")
    public ResponseSuccess rejectUpdateCarRequest(@RequestParam int draftId,@RequestParam String message) throws ApiException {
        try {
            adminService.updateCarRequestReject(draftId,message);
            return new ResponseSuccess<>(HttpStatus.OK.value(), "reject request success",null);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }
    @GetMapping("/get-car-request-detail-admin")
    public ResponseSuccess<CarRequestDetailResponse> getCarRequestDetailAdmin(@RequestParam int draftId) throws ApiException {
        try {
            return new ResponseSuccess<>(HttpStatus.OK.value(),"get detail success",adminService.getCarRequestDetailAdmin(draftId));
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }


    @Operation(summary = "Reject user draft", description = "Admin rejects a user draft and provides a reason")
    @PutMapping("/reject-user/{draftId}")
    public ResponseSuccess<?> rejectUserDraft(@PathVariable int draftId, @RequestParam String reason) throws ApiException {
        try {
            adminService.rejectUserDraft(draftId, reason);
            return new ResponseSuccess<>(HttpStatus.OK.value(), "User draft rejected successfully", null);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }


    @PostMapping(path = "/create-admin-voucher", consumes = "multipart/form-data")
    public ResponseSuccess createAdminVoucher(@RequestParam(value = "obj") String obj, @RequestParam(value = "systemImg",required = false) MultipartFile systemImg) throws ApiException {
        try {
            // Nếu obj null thì khởi tạo đối tượng rỗng tránh lỗi
            ObjectMapper objectMapper = new ObjectMapper();
            AdminVoucherRequest request = (obj != null && !obj.trim().isEmpty())
                    ? objectMapper.readValue(obj, AdminVoucherRequest.class)
                    : null;
            //validate request
            if (request != null) {
                Validator validator = Validation.buildDefaultValidatorFactory().getValidator();
                Set<ConstraintViolation<AdminVoucherRequest>> violations = validator.validate(request);
                if (!violations.isEmpty()) {
                    throw new ApiException(HttpStatus.BAD_REQUEST.value(), violations.iterator().next().getMessage());
                }
            }
            adminService.createVoucherByAdmin(request,systemImg);
            return new ResponseSuccess<>(HttpStatus.OK.value(), "Admin voucher created successfully", null);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            }else if(e instanceof IOException){
                throw new RuntimeException(e.getMessage());
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @PutMapping(path = "/edit-admin-voucher", consumes = "multipart/form-data")
    public ResponseSuccess editAdminVoucher(@RequestParam(value = "voucherId") int voucherId,@RequestParam(value = "obj") String obj, @RequestParam(value = "systemImg",required = false) MultipartFile systemImg) throws ApiException {

        try {
            // Nếu obj null thì khởi tạo đối tượng rỗng tránh lỗi
            ObjectMapper objectMapper = new ObjectMapper();
            AdminVoucherEditRequest request = (obj != null && !obj.trim().isEmpty())
                    ? objectMapper.readValue(obj, AdminVoucherEditRequest.class)
                    : null;
            //validate request
            if (request != null) {
                Validator validator = Validation.buildDefaultValidatorFactory().getValidator();
                Set<ConstraintViolation<AdminVoucherEditRequest>> violations = validator.validate(request);
                if (!violations.isEmpty()) {
                    throw new ApiException(HttpStatus.BAD_REQUEST.value(), violations.iterator().next().getMessage());
                }
            }
            adminService.editVoucherByAdmin(voucherId,request,systemImg);
            return new ResponseSuccess<>(HttpStatus.OK.value(), "Admin voucher edit successfully", null);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            }else if(e instanceof IOException){
                throw new RuntimeException(e.getMessage());
            }else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }
    @Operation(summary = "Get latest user draft details", description = "Retrieve details of the latest user draft")
    @GetMapping("/profile-draft/{draftId}")
    public ResponseSuccess<UserDetailResponse> getLatestUserDraft(@PathVariable("draftId") int draftId) throws ApiException {
        try {
            UserDetailResponse userDraftDetail = userService.getDraftDetail(draftId);
            return new ResponseSuccess<>(HttpStatus.OK.value(), "Successfully retrieved draft details", userDraftDetail);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }


    @GetMapping("/draft-list")
    public ResponseSuccess<UserDraftPageResponse> getUserDraftList(
            @RequestParam(required = false) UserDraftStatus status,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String search) throws ApiException {
        try {
            UserDraftPageResponse response = adminService.getDraftList(status, page, sort, search);
            return new ResponseSuccess<>(HttpStatus.OK.value(), "Successfully retrieved list of drafts", response);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }





    @Operation(summary = "Update user details", description = "Admin updates user details including email and roles")
    @PostMapping("/update-user/{userId}")
    public ResponseSuccess<?> updateUser(@PathVariable int userId, @RequestBody AddUserRequestDTO requestDTO) throws ApiException {
        try {
            adminService.updateUser(userId, requestDTO);
            return new ResponseSuccess<>(HttpStatus.OK.value(), "User updated successfully", null);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }


    @Operation(summary = "Add a new user", description = "Admin creates a new user with email, password, and roles, and sets status as NOT_ACTIVE.")
    @PostMapping("/add-user")
    public ResponseSuccess<?> addUser(@RequestBody AddUserRequestDTO requestDTO) throws ApiException {
        try {
            String message = adminService.addUser(requestDTO);
            return new ResponseSuccess<>(HttpStatus.OK.value(), message, null);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @PutMapping("/activate-homepage-display")
    public ResponseSuccess activateHomepageDisplay(@RequestParam int voucherId) throws ApiException {
        try {
            adminService.activateVoucherHomepageDisplay(voucherId);
            return new ResponseSuccess<>(HttpStatus.OK.value(), "Activate homepage display successfully", null);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }
    @PutMapping("/deactivate-homepage-display")
    public ResponseSuccess deactivateHomepageDisplay(@RequestParam int voucherId) throws ApiException {
        try {
            adminService.deactivateVoucherHomepageDisplay(voucherId);
            return new ResponseSuccess<>(HttpStatus.OK.value(), "Deactivate homepage display successfully", null);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @Operation(summary = "View user detail", description = "Admin can see details of the authenticated user")
    @GetMapping("/user-detail/{id}")
    public ResponseSuccess<UserDetailResponse> getUser(@PathVariable int id) throws ApiException {
        try {
            UserDetailResponse userDetailResponse = adminService.getUserDetail(id);
            return new ResponseSuccess<>(200, "Success", userDetailResponse);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @Operation(summary = "Get all user roles", description = "Return list of distinct user roles in the system")
    @GetMapping("/user-roles")
    public ResponseSuccess<List<UserRoleResponse>> getAllUserRoles() throws ApiException {
        try {
            List<UserRoleResponse> roles = adminService.getAllUserRoles();
            return new ResponseSuccess<>(HttpStatus.OK.value(), "Success", roles);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @GetMapping("/dashboard")
    public ResponseSuccess<AdminDashboardResponse> getDashboard(@RequestParam String  startWeekDate,@RequestParam String endWeekDate,
                                                                @RequestParam String startMonthDate,@RequestParam String endMonthDate) throws ApiException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        try{
           Date startWeekDateParse = dateFormat.parse(startWeekDate);
           Date endWeekDateParse = dateFormat.parse(endWeekDate);
           Date startMonthDateParse = dateFormat.parse(startMonthDate);
           Date endMonthDateParse = dateFormat.parse(endMonthDate);
           return new  ResponseSuccess<>(HttpStatus.OK.value(),"get admin dashboard successfully" , adminService.getAdminDashboard(startWeekDateParse, endWeekDateParse, startMonthDateParse, endMonthDateParse));
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            }else if(e instanceof ParseException){
                throw new RuntimeException(e.getMessage());
            }else{
                throw new RuntimeException(e.getMessage());
            }
        }
    }

}
