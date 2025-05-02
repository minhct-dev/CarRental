package com.pjb2.rental_car.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pjb2.rental_car.dto.request.BookingRequestDTO;
import com.pjb2.rental_car.dto.request.EditBookingRequestDTO;
import com.pjb2.rental_car.dto.response.*;
import com.pjb2.rental_car.exception.ApiException;
import com.pjb2.rental_car.service.BookingService;
import com.pjb2.rental_car.util.Util;
import com.pjb2.rental_car.util.common.CarOwnerStatus;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Valid;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/booking")
public class BookingController {
    private final BookingService bookingService;
    private final Util util;

    @PreAuthorize("hasAuthority('user')")
    @GetMapping("/list")
    public ResponseSuccess<BookingPageResponse> list(@RequestHeader("Authorization") String token, @RequestParam(required = false) String sort, @RequestParam(defaultValue = "0") int Page, @RequestParam(defaultValue = "10") int Size) throws ApiException {
        try {
            BookingPageResponse ls = bookingService.bookingPage(token, sort, Page, Size);
            return new ResponseSuccess<>(200, "View Booking List Sucessfully", ls);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @PreAuthorize("hasAuthority('driver')")
    @GetMapping("/driver-booking-list")
    public ResponseSuccess<List<DriverBookingResponse>> list(@RequestHeader("Authorization") String token) throws ApiException {
        try {
            return new ResponseSuccess<>(200, "View Booking List Sucessfully", bookingService.viewDriverBooking(token));
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @PreAuthorize("HasAuthority('carOwner')")
    @GetMapping("/carOwner/list")
    public ResponseSuccess<CarOwnerBoookingPageReponse> bookingList(@RequestHeader("Authorization") String token, @RequestParam(required = false) String sort, @RequestParam(defaultValue = "0") int Page, @RequestParam(defaultValue = "10") int Size) throws ApiException {

        try {
            CarOwnerBoookingPageReponse ls = bookingService.carBookingPage(token, sort, Page, Size);
            return new ResponseSuccess<>(200, "View Booking List Sucessfully", ls);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @PreAuthorize("HasAuthority('user')")
    @GetMapping("/search-driver")
    public ResponseSuccess<List<DriverListReponse>> searchDriver(@RequestHeader("Authorization") String token,
                                                                 @RequestParam(required = false) String province,
                                                                 @RequestParam(required = false) String district,
                                                                 @RequestParam(required = false) String ward) throws ApiException {
        try {
            if (province != null && province.isEmpty()) {
                province = null;
            }
            if (district != null && district.isEmpty()) {
                district = null;
            }
            if (ward != null && ward.isEmpty()) {
                ward = null;
            }

            return new ResponseSuccess<>(200, "Search driver Sucessfully", bookingService.SearchDriverByCategory(token, province, district, ward));

        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @PreAuthorize("hasAuthority('user')")
    @PostMapping("/rent-car")
    public ResponseSuccess<BookingResponse> rentcar(
            @RequestHeader(name = "Authorization", required = true) String token,

            @RequestParam(value = "obj") String objJson,

            @RequestParam(required = false) int paymentChoice,

            @RequestParam(required = false, defaultValue = "") String voucherCode
    ) throws ApiException {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
            BookingRequestDTO bookingRequest = (objJson != null && !objJson.trim().isEmpty())
                    ? objectMapper.readValue(objJson, BookingRequestDTO.class)
                    : null;

            if (bookingRequest != null) {
                Validator validator = Validation.buildDefaultValidatorFactory().getValidator();
                Set<ConstraintViolation<BookingRequestDTO>> violations = validator.validate(bookingRequest);
                if (!violations.isEmpty()) {
                    throw new ApiException(HttpStatus.BAD_REQUEST.value(), violations.iterator().next().getMessage());
                }
            }

            return new ResponseSuccess<>(200, "Booking processing", bookingService.rentACar(token, bookingRequest, paymentChoice, voucherCode));
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else if(e instanceof IOException) {
                throw new RuntimeException(e.getMessage());
            }else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @PreAuthorize("hasAuthority('user')")
    @PutMapping(path = "/edit",consumes = "multipart/form-data")
    public ResponseSuccess<BookingResponse> edit(@RequestParam int bookingId,
                                        @RequestHeader("Authorization") String token,
                                        @RequestParam(value = "driverLicenseFront", required = false) MultipartFile licenseFront,
                                        @RequestParam(value = "driverLicenseBack", required = false) MultipartFile licenseBack,
                                        @RequestParam(value = "obj") String objJson
    ) throws ApiException {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
            EditBookingRequestDTO bookingRequest = (objJson != null && !objJson.trim().isEmpty())
                    ? objectMapper.readValue(objJson, EditBookingRequestDTO.class)
                    : null;

            if (bookingRequest != null) {
                Validator validator = Validation.buildDefaultValidatorFactory().getValidator();
                Set<ConstraintViolation<EditBookingRequestDTO>> violations = validator.validate(bookingRequest);
                if (!violations.isEmpty()) {
                    throw new ApiException(HttpStatus.BAD_REQUEST.value(), violations.iterator().next().getMessage());
                }
            }
            return new ResponseSuccess<>(200, "Booking processing", bookingService.editBooking(bookingId, token, bookingRequest, licenseFront,licenseBack));
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


    @PreAuthorize("hasAuthority('user')")
    @PatchMapping("return-car")
    public ResponseSuccess<BookingBillResponse> returnCar(@RequestHeader("Authorization") String token,
                                                          @RequestParam int bookingId,
                                                          @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm") Date actualTime) throws ApiException {
        try {
            return new ResponseSuccess<>(200, "Return car successfully", bookingService.returnCar(token, bookingId, actualTime));
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @PreAuthorize("hasAuthority('user')")
    @GetMapping("return-bill")
    public ResponseSuccess<BookingBillResponse> returnBill(@RequestHeader("Authorization") String token,
                                                           @RequestParam int bookingId) throws ApiException {
        try {
            return new ResponseSuccess<>(200, "Return bill successfully", bookingService.returnBill(token, bookingId));
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @PreAuthorize("hasAuthority('user')")
    @PutMapping("paid-payment")
    public ResponseSuccess<String> paidPayment(@RequestHeader("Authorization") String token,
                                               @RequestParam int bookingId
                                               ) throws ApiException {
        try {
            return new ResponseSuccess<>(200, "Payment successfully", bookingService.paidPayment(token, bookingId));
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @PreAuthorize("hasAuthority('user')")
    @PutMapping("/cancel-booking-by-customer")
    public ResponseSuccess<String> cancelBookingForCustomer(@RequestHeader("Authorization") String token,
                                                            @RequestParam int bookingId
    ) throws ApiException {
        try {
            return new ResponseSuccess<>(200, "Cancel booking process", bookingService.cancelBoookingForCustomer(token, bookingId));
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @PreAuthorize("hasAuthority('carOwner')")
    @PutMapping("/handling-cancel")
    public ResponseSuccess<String> handelCancel(@RequestHeader("Authorization") String token,
                                                @RequestParam int bookingId,
                                                @RequestParam int choice)
            throws ApiException {
        try {
            return new ResponseSuccess<>(200, "Cancel booking process", bookingService.handleCancelBookingByCarOwner(token, bookingId, choice));
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @PreAuthorize("hasAuthority('carOwner')")
    @PutMapping("/cancel-booking-by-owner")
    public ResponseSuccess<String> rejectByCarOwner(@RequestHeader("Authorization") String token,
                                                    @RequestParam int bookingId)
            throws ApiException {
        try {
            return new ResponseSuccess<>(200, "Cancel booking process", bookingService.rejectByCarOwner(token, bookingId));
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @PreAuthorize("hasAuthority('driver')")
    @PatchMapping("/cancel-booking-by-driver")
    public ResponseSuccess<String> rejectByDriver(@RequestHeader("Authorization") String token,
                                                  @RequestParam int bookingId)
            throws ApiException {
        try {
            return new ResponseSuccess<>(200, "Cancel booking process", bookingService.rejectByDriver(token, bookingId));
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @GetMapping("/getBooking")
    public ResponseSuccess<BookingInfoResponse> getBooking(@RequestHeader("Authorization") String token, @RequestParam int bookingId) throws ApiException {
        try {
            return new ResponseSuccess<>(200, "Booking successfully", bookingService.getBookingInfo(token, bookingId));
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }
   //AnhCP2
   @PreAuthorize("hasAuthority('carOwner')")
   @Operation(summary = "Confirm deposit", description = "Car owner confirms the deposit and updates booking status.")
   @PatchMapping("/confirm-deposit/{bookingId}")
   public ResponseSuccess<Void> confirmDepositByCarOwner(
           @PathVariable @Min(1) @Valid Integer bookingId) throws ApiException {
       try {
           bookingService.confirmDepositByCarOwner(bookingId);
           return new ResponseSuccess<>(HttpStatus.OK.value(), "Deposit confirmed successfully", null);
       } catch (Exception e) {
           if (e instanceof ApiException) {
               throw (ApiException) e;
           } else {
               throw new RuntimeException(e.getMessage());
           }
       }
   }

    @PreAuthorize("hasAuthority('driver')")
    @Operation(summary = "Confirm booking", description = "Driver confirms booking and updates booking status.")
    @PatchMapping("/driver-confirm/{bookingId}")
    public ResponseSuccess<Void> confirmBookingByDriver(
            @PathVariable @Min(1) @Valid Integer bookingId) throws ApiException {
        try {
            bookingService.confirmBookingByDriver(bookingId);
            return new ResponseSuccess<>(HttpStatus.OK.value(), "Booking confirmed successfully", null);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @PreAuthorize("hasAuthority('carOwner')")
    @Operation(summary = "Confirm payment", description = "Confirm that the car owner has received the payment and update booking status.")
    @PatchMapping("/confirm-payment/{bookingId}")
    public ResponseSuccess<Void> confirmPayment(@PathVariable @Min(1) int bookingId) throws ApiException {
        try {
            bookingService.confirmPayment(bookingId);
            return new ResponseSuccess<>(HttpStatus.OK.value(), "Payment confirmed successfully", null);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @PreAuthorize("hasAuthority('user')")
    @Operation(summary = "Confirm pick-up", description = "Allow customer to confirm pick-up and update booking status.")
    @PatchMapping("/confirm-pickup/{bookingId}")
    public ResponseSuccess<Void> confirmPickup(@PathVariable @Min(1) @Valid int bookingId) throws ApiException {
        try {
            bookingService.confirmPickup(bookingId);
            return new ResponseSuccess<>(HttpStatus.OK.value(), "Pick-up confirmed successfully", null);
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @PreAuthorize("hasAuthority('user')")
    @GetMapping("/check-car-owner-status")
    public ResponseSuccess<CarOwnerStatus> checkStatusCarOwner(@RequestParam int bookingId) throws ApiException {
        try {
            return new ResponseSuccess<>(200, "Check status succesfully", bookingService.checkCarOwnerStatus(bookingId));
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    @PreAuthorize("hasAuthority('carOwner')")
    @PatchMapping("/change-car-status")
    public ResponseSuccess<String> changeCarStatus(@RequestParam int carId) throws ApiException {
        try {
            return new ResponseSuccess<>(200, "Change car status processing", bookingService.changeStatusRentCar(carId));
        } catch (Exception e) {
            if (e instanceof ApiException) {
                throw (ApiException) e;
            } else {
                throw new RuntimeException(e.getMessage());
            }
        }
    }

}
