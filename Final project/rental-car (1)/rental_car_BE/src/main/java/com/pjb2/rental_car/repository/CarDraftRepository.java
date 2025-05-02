package com.pjb2.rental_car.repository;

import com.pjb2.rental_car.entity.CarDraft;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarDraftRepository extends JpaRepository<CarDraft, Integer> {
    @Query(value = "SELECT * FROM car_draf  WHERE user_id = :userId  AND type LIKE :type AND status is NULL  ORDER BY updated_at DESC  LIMIT 1", nativeQuery = true)
    CarDraft findNearestCarDraftByUserId(@Param("userId") int userId,@Param("type") String type);
    @Query(value = "select * from car_draf where id= :draftId", nativeQuery = true)
    CarDraft findCarDraftById(@Param("draftId") int id);

    @Query(value = "select * from car_draf where status like :status",nativeQuery = true)
    List<CarDraft> findByStatus(@Param("status") String status);
    @Query(value = "SELECT * FROM car_draf " +
            "WHERE (:status IS NULL OR status like :status) " +
            "AND (:type IS NULL OR type like :type) " +
            "AND status IS NOT NULL",
            nativeQuery = true)
    Page<CarDraft> findAllCarDraftRequest(@Param("status") String status,
                                          @Param("type") String type,
                                          Pageable pageable);

    @Query(value = "select * from car_draf where user_id=:userId AND status IS NOT null AND is_deleted is FALSE",nativeQuery = true)
    Page<CarDraft> findAllCarDraftRequestByUserId(@Param("userId") int userId,Pageable pageable);

}
