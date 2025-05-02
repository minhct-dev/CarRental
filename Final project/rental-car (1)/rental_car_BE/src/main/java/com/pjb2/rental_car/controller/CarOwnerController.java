package com.pjb2.rental_car.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pjb2.rental_car.dto.request.*;
import com.pjb2.rental_car.dto.response.*;
import com.pjb2.rental_car.exception.ApiException;
import com.pjb2.rental_car.service.CarOwnerService;
import com.pjb2.rental_car.service.CarService;
import com.pjb2.rental_car.service.impl.CarServiceImpl;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/car_owner")
@Tag(name = "Car Owner Controller")
@RequiredArgsConstructor
public class CarOwnerController {
    private final CarOwnerService carOwnerService;
    private final CarService carService;
    private final CarServiceImpl carServiceImpl;

    @GetMapping("/list_car")
    public ResponseSuccess<MyCarPageResponse> getMyCarResponse(@RequestHeader(name = "Authorization", required = true) String token, @RequestParam(required = false) String sort, @RequestParam(defaultValue = "0") int Page, @RequestParam(defaultValue = "10") int Size) {
        try {
            MyCarPageResponse data = carService.getListCar(token, sort, Page, Size);
            return new ResponseSuccess<>(HttpStatus.OK.value(), "response car list successfully", data);
        } catch (Exception e) {
                throw new RuntimeException(e.getMessage());
        }
    }
    //List all draft of user where is pending for admin or is rejected by admin
    @GetMapping("/list_draft")
    public ResponseSuccess<MyCarDraftPageResponse> getMyCarDraftResponse(@RequestHeader(name = "Authorization", required = true) String token,@RequestParam(required = false) String sort, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size)throws ApiException {
        try {
            return new ResponseSuccess<>(HttpStatus.OK.value(), "Get draft list success",carOwnerService.getListCarDraft(token,sort,page,size));
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @PostMapping(value = "/addcar_step1", consumes = "multipart/form-data")
    public ResponseSuccess<CarStep1Respone> addCarStep1(@RequestHeader(name = "Authorization", required = true) String token, @RequestParam(value = "registration", required = false) List<MultipartFile> registration
            , @RequestParam(value = "certificate", required = false) List<MultipartFile> certificate
            , @RequestParam(value = "insurance", required = false) List<MultipartFile> insurance
            , @RequestParam(value = "obj") String obj
            , @RequestParam(required = false) Integer draftId
            , @RequestParam String type) throws ApiException {
        try {
            // Nếu obj null thì khởi tạo đối tượng rỗng tránh lỗi
            ObjectMapper objectMapper = new ObjectMapper();
            CarStep1Request request = (obj != null && !obj.trim().isEmpty())
                    ? objectMapper.readValue(obj, CarStep1Request.class)
                    : null;

            // Nếu danh sách file null, gán giá trị rỗng để tránh lỗi
            registration = (registration != null) ? registration : new ArrayList<>();
            certificate = (certificate != null) ? certificate : new ArrayList<>();
            insurance = (insurance != null) ? insurance : new ArrayList<>();
            //validate request
            if (request != null) {
                Validator validator = Validation.buildDefaultValidatorFactory().getValidator();
                Set<ConstraintViolation<CarStep1Request>> violations = validator.validate(request);
                if (!violations.isEmpty()) {
                    throw new ApiException(HttpStatus.BAD_REQUEST.value(), violations.iterator().next().getMessage());
                }
            }

            return new ResponseSuccess<>(HttpStatus.ACCEPTED.value(), "Add step 1 successfully", carService.addCarStep1(token, draftId, type, registration, certificate, insurance, request));

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

    @PatchMapping(value = "/addcar_step2", consumes = "multipart/form-data")
    public ResponseSuccess<CarStep2Response> addCarStep2(@RequestParam int draftId, @RequestParam String type,
                                                         @RequestParam(value = "file", required = false) List<MultipartFile> files,
                                                         @RequestPart(value = "obj", required = false) String obj) throws ApiException {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            CarStep2Request request = (obj != null && !obj.trim().isEmpty())
                    ? objectMapper.readValue(obj, CarStep2Request.class)
                    : null;

            files = (files != null) ? files : new ArrayList<>();
            //validate request
            if (request != null) {
                Validator validator = Validation.buildDefaultValidatorFactory().getValidator();
                Set<ConstraintViolation<CarStep2Request>> violations = validator.validate(request);
                if (!violations.isEmpty()) {
                    throw new ApiException(HttpStatus.BAD_REQUEST.value(), violations.iterator().next().getMessage());
                }
            }
            return new ResponseSuccess(HttpStatus.ACCEPTED.value(), "Add car step 2 succesfully", carService.addCarStep2(draftId, type, files, request));
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            }else if(e instanceof IOException) {
                throw new RuntimeException(e.getMessage());
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @PatchMapping("/addcar_step3")
    public ResponseSuccess<CarStep4Response> addCarStep3(@RequestParam int draftId, @RequestParam String type, @RequestParam(value = "obj", required = false) String obj) throws ApiException {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            CarStep3Request request = (obj != null && !obj.trim().isEmpty())
                    ? objectMapper.readValue(obj, CarStep3Request.class)
                    : null;
            if (request != null) {
                Validator validator = Validation.buildDefaultValidatorFactory().getValidator();
                Set<ConstraintViolation<CarStep3Request>> violations = validator.validate(request);
                if (!violations.isEmpty()) {
                    throw new ApiException(HttpStatus.BAD_REQUEST.value(), violations.iterator().next().getMessage());
                }
            }
            return new ResponseSuccess<>(HttpStatus.ACCEPTED.value(), "Add car step 3 succesfully", carService.addCarStep3(draftId, type, request));
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            }else if(e instanceof IOException) {
                throw new RuntimeException(e.getMessage());
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @GetMapping("/addcar_step4")
    public ResponseSuccess<CarStep4Response> addCarStep4(@RequestParam int draftId) throws ApiException {
        try {
            return new ResponseSuccess<>(HttpStatus.ACCEPTED.value(), "Add car step 4 successfully", carService.addCarStep4(draftId));
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @PostMapping("/addcar_submit")
    public ResponseSuccess submit(@RequestParam int draftId) throws ApiException {
        try {
            carServiceImpl.addCarSubmitButton(draftId);
            return new ResponseSuccess<>(HttpStatus.ACCEPTED.value(), "Submit car step successfully", null);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            }else if(e instanceof IOException) {
                throw new RuntimeException(e.getMessage());
            }  else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @GetMapping("/draft_process")
    public ResponseSuccess<CarDraftResponse> draftProcess(@RequestHeader(name = "Authorization") String token) throws ApiException {
        try {
            return new ResponseSuccess<>(HttpStatus.OK.value(), "get process succesfully", carService.getCarDraftProcess(token));
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @PostMapping("/car-edit-information")
    public ResponseSuccess carEditInformation(@RequestHeader(name = "Authorization") String token, @RequestParam int carId,
                                                 @RequestParam(value = "file", required = false) List<MultipartFile> files,
                                                 @RequestParam(value = "registration", required = false) List<MultipartFile> registration,
                                                 @RequestParam(value = "certificate", required = false) List<MultipartFile> certificate,
                                                 @RequestParam(value = "insurance", required = false) List<MultipartFile> insurance,
                                              @RequestPart(value = "obj", required = false) String obj) throws ApiException {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            CarDraftEditRequest request = (obj != null && !obj.trim().isEmpty())
                    ? objectMapper.readValue(obj, CarDraftEditRequest.class)
                    : null;
            // Nếu danh sách file null, gán giá trị rỗng để tránh lỗi
            registration = (registration != null) ? registration : new ArrayList<>();
            certificate = (certificate != null) ? certificate : new ArrayList<>();
            insurance = (insurance != null) ? insurance : new ArrayList<>();
            files = (files != null) ? files : new ArrayList<>();
            //validate request
            if (request != null) {
                Validator validator = Validation.buildDefaultValidatorFactory().getValidator();
                Set<ConstraintViolation<CarDraftEditRequest>> violations = validator.validate(request);
                if (!violations.isEmpty()) {
                    throw new ApiException(HttpStatus.BAD_REQUEST.value(), violations.iterator().next().getMessage());
                }
            }
            carOwnerService.editCarInformation(token,carId,files,registration,certificate,insurance,request);
            return new ResponseSuccess<>(HttpStatus.ACCEPTED.value(), "Edit car successfully", null);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            }else if(e instanceof IOException) {
                throw new RuntimeException(e.getMessage());
            }  else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @GetMapping("/get-car-information-editScreen")
    public ResponseSuccess<CarInformationResponse> carInformation(@RequestParam(name = "carId") int carId) throws ApiException {
        try {
            return new ResponseSuccess<>(HttpStatus.ACCEPTED.value(),"get car information success",carService.getEditCarScreenInformation(carId));
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }
    @DeleteMapping("/draft-delete")
    public ResponseSuccess deleteDraft(@RequestParam int draftId) throws ApiException {
        try {
            carService.deleteCarDraft(draftId);
            return new ResponseSuccess<>(HttpStatus.ACCEPTED.value(), "Delete car draft successfully", null);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }
    @DeleteMapping("/draft-delete-data")
    public ResponseSuccess deleteDraftOutOfData(@RequestHeader(name = "Authorization") String token ,@RequestParam int draftId) throws ApiException {
        try {
            carService.deleteCarDraftOutOfDatabase(token,draftId);
            return new ResponseSuccess<>(HttpStatus.ACCEPTED.value(), "Delete car draft out of data successfully", null);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @PatchMapping("/car-delete")
    public ResponseSuccess deleteCar(@RequestHeader(name = "Authorization") String token ,@RequestParam int carId) throws ApiException {
        try {
            carService.deleteCar(token,carId);
            return new ResponseSuccess<>(HttpStatus.ACCEPTED.value(), "Delete car successfully", null);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @GetMapping("/feedback-report-view")
    public ResponseSuccess<FeedbackReportPageResponse> feedbackReportView(@RequestHeader(name = "Authorization") String token, @RequestParam(required = false) String sort, @RequestParam(defaultValue = "0") int page
                                                                            , @RequestParam(defaultValue = "10") int size,@RequestParam(defaultValue = "0") int starRating) throws ApiException {
        try {
            return new ResponseSuccess<>(HttpStatus.ACCEPTED.value(), "get feedback report view successfully", carOwnerService.getListFeedbackReport(token,sort,page,size,starRating));
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @PutMapping(path = "/edit-car-draft",consumes = "multipart/form-data")
    public ResponseSuccess editCarDraft(@RequestHeader(name = "Authorization") String token ,@RequestParam int draftId,@RequestParam(value = "registration", required = false) List<MultipartFile> registration
            , @RequestParam(value = "certificate", required = false) List<MultipartFile> certificate
            , @RequestParam(value = "insurance", required = false) List<MultipartFile> insurance
            , @RequestParam(value = "file", required = false) List<MultipartFile> files
            , @RequestParam(value = "obj") String obj) throws ApiException {

        try {
            // Nếu obj null thì khởi tạo đối tượng rỗng tránh lỗi
            ObjectMapper objectMapper = new ObjectMapper();
            CarDraftEditRequest request = (obj != null && !obj.trim().isEmpty())
                    ? objectMapper.readValue(obj, CarDraftEditRequest.class)
                    : null;
            // Nếu danh sách file null, gán giá trị rỗng để tránh lỗi
            registration = (registration != null) ? registration : new ArrayList<>();
            certificate = (certificate != null) ? certificate : new ArrayList<>();
            insurance = (insurance != null) ? insurance : new ArrayList<>();
            files = (files != null) ? files : new ArrayList<>();
            //validate request
            if (request != null) {
                Validator validator = Validation.buildDefaultValidatorFactory().getValidator();
                Set<ConstraintViolation<CarDraftEditRequest>> violations = validator.validate(request);
                if (!violations.isEmpty()) {
                    throw new ApiException(HttpStatus.BAD_REQUEST.value(), violations.iterator().next().getMessage());
                }
            }
            carOwnerService.editCarDraft(token,draftId,registration,certificate,insurance,files,request);
            return new ResponseSuccess<>(HttpStatus.ACCEPTED.value(), "Edit car draft successfully", null);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            }else if(e instanceof IOException) {
                throw new RuntimeException(e.getMessage());
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @DeleteMapping("/cancel-update-draft")
    public ResponseSuccess cancelUpdateDraft(@RequestHeader(name = "Authorization") String token,@RequestParam int draftId) throws ApiException {
        try {
            carOwnerService.deleteUpdateCarDraft(token,draftId);
            return new ResponseSuccess<>(HttpStatus.ACCEPTED.value(), "Delete car draft successfully", null);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @PostMapping("/create-car-owner-voucher")
    public ResponseSuccess createCarOwnerVoucher(@RequestHeader(name = "Authorization") String token ,@RequestBody @Valid CarOwnerVoucherRequest request) throws ApiException {
        try {
            carOwnerService.createVoucherByCarOwner(token,request);
            return new ResponseSuccess<>(HttpStatus.ACCEPTED.value(), "Create car owner voucher successfully", null);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @PutMapping("/edit-car-owner-voucher")
    public ResponseSuccess editCarOwnerVoucher(@RequestHeader(name = "Authorization") String token ,@RequestParam int voucherId,@RequestBody @Valid CarOwnerVoucherEditRequest request) throws ApiException {
        try {
            carOwnerService.editVoucherByCarOwner(token,voucherId,request);
            return new ResponseSuccess<>(HttpStatus.ACCEPTED.value(), "Edit car owner voucher successfully", null);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }
    @GetMapping("/dashboard")
    public ResponseSuccess<CarOwnerDashboardResponse> getDashboard(@RequestHeader(name = "Authorization") String token,@RequestParam String  startWeekDate,@RequestParam String endWeekDate,
                                                                   @RequestParam String startMonthDate,@RequestParam String endMonthDate) throws ApiException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Date startWeekDateParsed = dateFormat.parse(startWeekDate);
            Date endWeekDateParsed = dateFormat.parse(endWeekDate);
            Date startMonthDateParsed = dateFormat.parse(startMonthDate);
            Date endMonthDateParsed = dateFormat.parse(endMonthDate);
            return new ResponseSuccess<>(HttpStatus.ACCEPTED.value(), "get dashboard successfully",
                    carOwnerService.getCarOwnerDashboard(token, startWeekDateParsed, endWeekDateParsed, startMonthDateParsed, endMonthDateParsed));

        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            }else if(e instanceof ParseException){
                throw new RuntimeException(e.getMessage());
            }
            else {
                throw new RuntimeException(e.getMessage());
            }
        }

    }
}
