package com.pjb2.rental_car.repository;

import com.pjb2.rental_car.entity.User;
import com.pjb2.rental_car.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Integer> {
    @Query(value = "select * from voucher where type like 'ADMIN_VOUCHER' and is_deleted is false ",nativeQuery = true)
    List<Voucher> findAdminVouchers();
    @Query(value = "select * from voucher where type like 'CAR_OWNER_VOUCHER' and user_id=:ownerId and is_deleted is false ",nativeQuery = true)
    List<Voucher> findCarOwnerVouchers(@Param("ownerId") int ownerId);
    @Query(value = "select v.* from voucher v where type like 'ADMIN_VOUCHER' and status like 'ACTIVE'and voucher_scope like 'PUBLIC' and is_deleted is false ",nativeQuery = true)
    List<Voucher> getListCarAdminVoucher(@Param("brandId") int brandId, @Param("modelId") int modelId);

    @Query(value = "SELECT v.* FROM voucher v "
            + "LEFT JOIN voucher_car vc ON v.id = vc.voucher_id "
            + "WHERE v.type = 'CAR_OWNER_VOUCHER' "
            + "AND v.status = 'ACTIVE' "
            + "AND v.voucher_scope = 'PUBLIC' "
            + "AND v.is_deleted = FALSE "
            + "AND (vc.car_id = :carId OR vc.voucher_id IS NULL) AND user_id=:carOwnerId",
            nativeQuery = true)
    List<Voucher> getListCarOwnerVoucher(@Param("carId") int carId, @Param("carOwnerId") int carOwnerId);
    @Query(value = "SELECT v.* FROM voucher v " +
            "where code =:voucherCode AND is_deleted = FALSE and status = 'ACTIVE' "
            ,nativeQuery = true)
    Voucher searchVoucherByCodeAndCarId(@Param("carId") int carId,@Param("voucherCode") String voucherCode,@Param("brandId") int brandId, @Param("modelId") int modelId);
    @Query(value = """ 
            Select * from voucher
                where type = 'ADMIN_VOUCHER' 
                and is_deleted = false
                and is_homepage_display is true
            """,nativeQuery = true)
    List<Voucher> findAllHomepageDisplayedVouchers();

    @Query(value = "SELECT v.* FROM voucher v " +
            "WHERE v.code = :code " +
            "AND v.is_deleted = 0 " +
            "AND v.status = 'ACTIVE' " +
            "AND (v.quantity > 0 OR v.quantity = -1) " +
            "AND (NOW() >= v.start_date OR v.start_date IS NULL)",
            nativeQuery = true)
    Voucher getVoucherByCode(@Param("code") String code);
    @Query(value = "select * from voucher where code =:code and is_deleted is false limit 1",nativeQuery = true)
    Voucher isVoucherExisted(@Param("code") String code);



}
