package com.pjb2.rental_car.service.impl;

import com.pjb2.rental_car.dto.response.WalletResponse;
import com.pjb2.rental_car.entity.User;
import com.pjb2.rental_car.entity.Wallet;
import com.pjb2.rental_car.entity.WalletHistory;
import com.pjb2.rental_car.exception.ApiException;
import com.pjb2.rental_car.repository.UserRepository;
import com.pjb2.rental_car.repository.WalletHistoryRepository;
import com.pjb2.rental_car.repository.WalletRepository;
import com.pjb2.rental_car.service.WalletService;
import com.pjb2.rental_car.util.JwtService;
import com.pjb2.rental_car.util.common.WalletHistoryType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@Slf4j
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final WalletHistoryRepository walletHistoryRepository;

    @Override
    public Wallet getWalletByToken(String token) throws ApiException {
        String email = jwtService.getEmailFromToken(token);
        User user = userRepository.findByEmail(email);
        if (user == null || user.getWallet() == null) {
            throw new ApiException(HttpStatus.NOT_FOUND.value(), "Wallet not found");
        }
        return user.getWallet();
    }

    @Override
    public double getWalletBalance(String token) throws ApiException {
        Wallet wallet = getWalletByToken(token);
        return wallet.getBalance();
    }

    /**
     * Lấy lịch sử giao dịch của ví có phân trang
     */
    @Override
    public Page<Map<String, Object>> getWalletHistory(String token, LocalDate from, LocalDate to, int page, int size) throws ApiException {
        Wallet wallet = getWalletByToken(token);

        // Chuyển đổi từ LocalDate sang LocalDateTime
        LocalDateTime fromDateTime = from.atStartOfDay();
        LocalDateTime toDateTime = to.atTime(23, 59, 59);

        // VALIDATION
        LocalDate today = LocalDate.now();
        if (from.isAfter(to)) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Start date cannot be after end date.");
        }
        if (to.isAfter(today)){
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "End date cannot be in the future.");
        }
        if (from.isAfter(today)) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Start date cannot be in the future.");
        }
        if (from.isBefore(today.minusMonths(1))) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "You can only query transactions within the last 1 month.");
        }

        int adjustedPage = Math.max(page - 1, 0);
        Pageable pageable = PageRequest.of(adjustedPage, size, Sort.by("createdAt").descending());
        Page<WalletHistory> historyPage = walletHistoryRepository.findByWalletIdAndCreatedAtBetween(wallet.getId(), fromDateTime, toDateTime, pageable);

        AtomicInteger index = new AtomicInteger(adjustedPage * size + 1);

        return historyPage.map(history -> {
            Map<String, Object> record = new HashMap<>();
            record.put("No", index.getAndIncrement());
            record.put("Amount", history.getAmount());
            record.put("Type", history.getType().toString());
            record.put("DateTime", history.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
            record.put("BookingNo", history.getBooking() != null ? history.getBooking().getId() : null);
            record.put("CarName", history.getBooking() != null && history.getBooking().getCar() != null ? history.getBooking().getCar().getName() : null);
            record.put("Note", history.getNote() != null ? history.getNote() : "");
            return record;
        });
    }
    @Override
    public WalletResponse getWalletDetails(String token, LocalDate from, LocalDate to, int page, int size) throws ApiException {
        double balance = getWalletBalance(token);
        Page<Map<String, Object>> history = getWalletHistory(token, from, to, page, size);

        // Trả về cả ngày giờ
        return new WalletResponse(
                balance,
                history.getContent(),
                history.getTotalPages(),
                page,
                from,
                to
        );
    }


    /**
     * Lấy thông tin chi tiết ví (mặc định 7 ngày gần nhất)
     */
    @Override
    public WalletResponse getWalletDetails(String token) throws ApiException {
        double balance = getWalletBalance(token);
        LocalDate from = LocalDate.now().minusDays(7);
        LocalDate to = LocalDate.now();
        Page<Map<String, Object>> history = getWalletHistory(token, from, to, 0, 10);

        return new WalletResponse(
                balance,
                history.getContent(),
                history.getTotalPages(),
                0,
                from,
                to
        );
    }




    @Override
    public void topUp(String token, double amount, String note) throws ApiException {
        if (amount <= 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Amount must be greater than zero");
        }

        Wallet wallet = getWalletByToken(token);
        wallet.setBalance(wallet.getBalance() + amount);
        walletRepository.save(wallet);
        
        WalletHistory history = new WalletHistory();
        history.setWallet(wallet);
        history.setAmount(amount);
        history.setNote(note != null && !note.isEmpty() ? note : "");
        history.setType(WalletHistoryType.TOP_UP);
        walletHistoryRepository.save(history);
    }

    @Override
    public void withdraw(String token, double amount, String note) throws ApiException {
        if (amount <= 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Amount must be greater than zero");
        }

        Wallet wallet = getWalletByToken(token);
        if (wallet.getBalance() < amount) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Not enough balance");
        }

        wallet.setBalance(wallet.getBalance() - amount);
        walletRepository.save(wallet);

        WalletHistory history = new WalletHistory();
        history.setWallet(wallet);
        history.setAmount(-amount);
        history.setNote(note != null && !note.isEmpty() ? note : "");
        history.setType(WalletHistoryType.WITHDRAWAL);
        walletHistoryRepository.save(history);
    }
}
