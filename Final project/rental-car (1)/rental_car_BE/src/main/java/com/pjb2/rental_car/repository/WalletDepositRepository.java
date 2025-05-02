package com.pjb2.rental_car.repository;

import com.pjb2.rental_car.entity.Wallet;
import com.pjb2.rental_car.entity.WalletDeposit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WalletDepositRepository extends JpaRepository<WalletDeposit, Integer> {
}
