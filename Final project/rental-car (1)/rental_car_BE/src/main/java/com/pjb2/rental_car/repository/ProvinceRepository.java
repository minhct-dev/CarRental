package com.pjb2.rental_car.repository;

import com.pjb2.rental_car.entity.Province;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProvinceRepository extends JpaRepository<Province, String> {
    Optional<Object> findByCode(String code);
}
