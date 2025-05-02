package com.pjb2.rental_car.repository;

import com.pjb2.rental_car.entity.SystemImage;
import com.pjb2.rental_car.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SystemImageRepository extends JpaRepository<SystemImage, Integer> {
    @Query(value = "select * from system_images where voucher_id = :voucherId LIMIT 1",nativeQuery = true)
    SystemImage findByVoucherId(@Param("voucherId") int voucherId);
}
