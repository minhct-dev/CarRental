package com.pjb2.rental_car.repository;

import com.pjb2.rental_car.entity.CarImages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface CarImagesRepository extends JpaRepository<CarImages, Integer> {
    @Query(value = "SELECT * FROM car_images where car_id = :carId and type = 'CAR_IMAGE'",nativeQuery = true)
    List<CarImages> findCarImagesByCarId(@Param("carId") int carId);
    @Query(value = "SELECT * FROM car_images where car_id = :carId and type = 'REGISTRATION_IMAGE'",nativeQuery = true)
    List<CarImages> findRegistrationImagesByCarId(@Param("carId")int carId);
    @Query(value = "SELECT * FROM car_images where car_id = :carId and type = 'CERTIFICATE_IMAGE'",nativeQuery = true)
    List<CarImages> findCertificateImagesByCarId(@Param("carId")int carId);
    @Query(value = "SELECT * FROM car_images where car_id = :carId and type = 'INSURANCE_IMAGE'",nativeQuery = true)
    List<CarImages> findInsuranceImagesByCarId(@Param("carId")int carId);
    @Query(value = "SELECT * FROM car_images where car_draft_id = :draftId and type = 'CAR_IMAGE'",nativeQuery = true)
    List<CarImages> findCarImagesByDraftId(@Param("draftId") int draftId);
    @Query(value = "SELECT * FROM car_images where car_draft_id = :draftId and type = 'REGISTRATION_IMAGE'",nativeQuery = true)
    List<CarImages> findRegistrationImagesByDraftId(@Param("draftId")int draftId);
    @Query(value = "SELECT * FROM car_images where car_draft_id = :draftId and type = 'CERTIFICATE_IMAGE'",nativeQuery = true)
    List<CarImages> findCertificateImagesByDraftId(@Param("draftId")int draftId);
    @Query(value = "SELECT * FROM car_images where car_draft_id = :draftId and type = 'INSURANCE_IMAGE'",nativeQuery = true)
    List<CarImages> findInsuranceImagesByDraftId(@Param("draftId")int draftId);
    @Modifying
    @Transactional
    @Query(value = "UPDATE car_images \n" +
            "SET car_id = :carId \n" +
            "WHERE car_draft_id= :draftId",nativeQuery = true)
    void setCarImg(@Param("draftId") int draftId , @Param("carId") int carId);
    @Modifying
    @Transactional
    @Query(value = "UPDATE car_images \n" +
            "SET car_id = null \n" +
            "WHERE car_id= :carId",nativeQuery = true)
    void deleteCarImg(@Param("carId") int carId);
}
