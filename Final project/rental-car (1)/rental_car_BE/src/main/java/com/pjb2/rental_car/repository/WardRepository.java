package com.pjb2.rental_car.repository;

import com.pjb2.rental_car.entity.District;
import com.pjb2.rental_car.entity.Ward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WardRepository extends JpaRepository<Ward, String> {
    @Query(value = "select * from wards where district_code= :district_id",nativeQuery = true)
    List<Ward> findWardByDistrict(@Param("district_id") int id);

    Ward findByCode(String code);
}
