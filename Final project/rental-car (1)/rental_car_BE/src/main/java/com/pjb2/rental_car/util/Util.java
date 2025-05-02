package com.pjb2.rental_car.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pjb2.rental_car.dto.response.ResponseErr;
import com.pjb2.rental_car.entity.Car;
import com.pjb2.rental_car.entity.Voucher;
import com.pjb2.rental_car.repository.CarRepository;
import com.pjb2.rental_car.repository.VoucherRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.UUID;

@Component
public class Util {

    public final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads";
    private final VoucherRepository voucherRepository;
    private final CarRepository carRepository;

    public Util(VoucherRepository voucherRepository, CarRepository carRepository) {
        this.voucherRepository = voucherRepository;
        this.carRepository = carRepository;
    }

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


    public void setErrorResponse(HttpServletResponse response, int statusCode, String message) throws IOException {
        response.setStatus(statusCode);
        response.setContentType("application/json; charset=UTF-8");
        ResponseErr apiResponse = new ResponseErr(statusCode, message);
        ObjectMapper mapper = new ObjectMapper();
        String jsonResponse = mapper.writeValueAsString(apiResponse);
        response.getWriter().write(jsonResponse);
        response.getWriter().flush();
        response.getWriter().close();
    }

    public boolean isVoucherCodeExisted(String code){
        Voucher voucher = voucherRepository.isVoucherExisted(code);
        return voucher != null;
    }
    public boolean isLicencePlateExisted(String licencePlate) {
        Car car = carRepository.findCarByLicensePlate(licencePlate);
        return car != null;
    }
}
