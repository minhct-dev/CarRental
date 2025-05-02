package com.pjb2.rental_car.repository;

import com.pjb2.rental_car.dto.response.CarBrandResponse;
import com.pjb2.rental_car.dto.response.CarModelResponse;
import com.pjb2.rental_car.entity.Car;
import com.pjb2.rental_car.util.common.BookingStatus;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Integer> {

    //ANHCP2
    @Query("""
    SELECT c FROM Car c 
    WHERE (:provinceCode IS NULL OR c.province.code = :provinceCode)
    AND (:districtCode IS NULL OR c.district.code = :districtCode)
    AND (:wardCode IS NULL OR c.ward.code = :wardCode)
    AND (:brandId IS NULL OR c.carModel.brand.id = :brandId)
    AND (:modelId IS NULL OR c.carModel.id IN :modelId)
    AND (:name IS NULL OR c.name LIKE %:name%)
    AND (:fuelType IS NULL OR c.fuelType IN (:fuelType))
    AND (:transmissionType IS NULL OR c.transmissionType IN (:transmissionType))
    AND (:color IS NULL OR c.color IN (:color))
    AND (:minPrice IS NULL OR :maxPrice IS NULL OR c.basePrice BETWEEN :minPrice AND :maxPrice)
    AND c.isDeleted = false
    AND c.status <> 'STOPPED'
    AND (c.user IS NULL OR c.user.isBan = false)
    
""")
    Page<Car> searchAvailableCars(
            @Param("provinceCode") String provinceCode,
            @Param("districtCode") String districtCode,
            @Param("wardCode") String wardCode,
            @Param("pickupDate") Date pickupDate,
            @Param("dropoffDate") Date dropoffDate,
            @Param("name") String name,
            @Param("brandId") Integer brandId,
            @Param("modelId") List<Integer> modelId,
            @Param("fuelType") List<String> fuelType,
            @Param("transmissionType") List<String> transmissionType,
            @Param("color") List<String> color,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            Pageable pageable
    );


    @Query("""
    SELECT COALESCE(AVG(f.rating), 0), 
           (SELECT COUNT(b) FROM Booking b WHERE b.car.id = :carId AND b.status = :status)
    FROM Feedback f 
    WHERE f.car.id = :carId
""")
    Object[] getCarStats(@Param("carId") int carId, @Param("status") BookingStatus status);

    @Query(value = "select * from car where user_id= :user_id and is_deleted is false",nativeQuery = true)
    Page<Car> getCarById(@Param("user_id") int user_id, Pageable pageable);

    @Query("SELECT new com.pjb2.rental_car.dto.response.CarBrandResponse(b.id, b.name) FROM CarBrand b")
    List<CarBrandResponse> findAllBrands();

    @Query("SELECT new com.pjb2.rental_car.dto.response.CarModelResponse(cm.id, cm.name) " +
            "FROM CarModel cm " +
            "WHERE cm.brand.id = :brandId")
    List<CarModelResponse> findModelsByBrand(@Param("brandId") Integer brandId);

    @Query("SELECT DISTINCT c.color FROM Car c")
    List<String> findDistinctColors();

    @Query("SELECT MAX(c.basePrice) FROM Car c")
    Double findMaxPrice();

    @Query("""
    SELECT c FROM Car c 
    WHERE c.user.id = :ownerId 
      AND c.status = com.pjb2.rental_car.util.common.CarStatus.AVAILABLE 
      AND c.isDeleted <> true
""")
    Page<Car> findCarsByOwnerId(@Param("ownerId") int ownerId, Pageable pageable);



    List<Car> findByUserId(int userId);

    List<Car> findByIdIn(List<Integer> ids);

    @Query(value = "select * from car where user_id= :user_id and is_deleted is false",nativeQuery = true)
    List<Car> getCarByUserId(@Param("user_id") int user_id);

    @Query("SELECT c.id FROM Car c WHERE c.user.id = :ownerId AND c.isDeleted = false")
    List<Integer> findCarIdsByOwnerId(@Param("ownerId") int ownerId);

    @Query(value = "select * from Car where licence_plate=:licensePlate and is_deleted is FALSE LIMIT 1 ",nativeQuery = true)
    Car findCarByLicensePlate(@Param("licensePlate") String licensePlate);


}
