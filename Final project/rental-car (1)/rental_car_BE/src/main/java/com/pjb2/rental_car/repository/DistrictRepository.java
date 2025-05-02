package com.pjb2.rental_car.repository;

import com.pjb2.rental_car.entity.District;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DistrictRepository extends JpaRepository<District, String> {
    @Query(value = "select * from districts where province_code= :province_id",nativeQuery = true)
    List<District> findDistrictByProvince(@Param("province_id") int id);

    District findByCode(String code);
}
