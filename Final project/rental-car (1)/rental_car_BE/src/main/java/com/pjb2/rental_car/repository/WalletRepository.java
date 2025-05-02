package com.pjb2.rental_car.repository;

import com.pjb2.rental_car.entity.Wallet;
import com.pjb2.rental_car.entity.WalletHistory;
import com.pjb2.rental_car.util.common.UserWalletType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Integer> {
    @Query("SELECT w FROM Wallet w WHERE w.walletType = :walletType")
    Wallet findByWalletType(@Param("walletType") UserWalletType walletType);

}
