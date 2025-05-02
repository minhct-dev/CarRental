package com.pjb2.rental_car.service.impl;

import com.pjb2.rental_car.dto.request.RegisterUserDTO;
import com.pjb2.rental_car.dto.response.TokenResponseDTO;
import com.pjb2.rental_car.entity.Role;
import com.pjb2.rental_car.entity.User;
import com.pjb2.rental_car.entity.UserImages;
import com.pjb2.rental_car.entity.Wallet;
import com.pjb2.rental_car.exception.ApiException;
import com.pjb2.rental_car.repository.RoleRepository;
import com.pjb2.rental_car.repository.UserImagesRepository;
import com.pjb2.rental_car.repository.UserRepository;
import com.pjb2.rental_car.repository.WalletRepository;
import com.pjb2.rental_car.service.AdminService;
import com.pjb2.rental_car.service.AuthService;
import com.pjb2.rental_car.service.EmailService;
import com.pjb2.rental_car.util.JwtService;
import com.pjb2.rental_car.util.common.UserImageType;
import com.pjb2.rental_car.util.common.UserStatus;
import com.pjb2.rental_car.util.common.UserWalletType;
import jakarta.transaction.Transactional;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.*;

import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Builder
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final UserImagesRepository userImagesRepository;
    private final AdminService adminService;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final RedisTemplate<String, String> redisTemplate;

    //sớm mai sau khi push phần register sẽ làm bắn lỗi cho login
    @Override
    @Transactional
    public TokenResponseDTO login(String email, String password) throws ApiException {
        UsernamePasswordAuthenticationToken authenticationToken
                = new UsernamePasswordAuthenticationToken(email, password);
        authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        User user = userRepository.findByEmail(email);

        if (user != null) {
            boolean isBan = adminService.checkBanStatus(user.getId());
            if (isBan) {
                String banMessage = "Your account had been banned for " +
                        (user.getBanDuration() <= 0 ? "unknown" : adminService.formatDuration(user.getBanDuration()))
                        + " because " + user.getBanReason();

                throw new ApiException(400, banMessage);
            }
            if (passwordEncoder.matches(password, user.getPassword())) {
                if (user.getStatus().equals(UserStatus.NOT_ACTIVE)) {
                    throw new ApiException(400, "Your account is not activated. Please check your email to activate your account before logging in");
                } else {
                    String AT = jwtService.createToken(user);
                    String RT = jwtService.createRefreshToken(user);
                    user.setRefreshToken(RT);
                    userRepository.save(user);
                    return new TokenResponseDTO(AT, RT);
                }
            } else {
                throw new ApiException(HttpStatus.UNAUTHORIZED.value(), "Either email address or password is incorrect. Please try again");
            }
        } else {
            throw new ApiException(HttpStatus.UNAUTHORIZED.value(), "User is not found!");
        }
    }

    @Override
    @Transactional
    public String register(RegisterUserDTO user) throws ApiException {
        if (!user.getConfirmPassword().equals(user.getPassword())) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Password and Confirm password don't match. Please try again");
        }
        if (!Pattern.matches("^(?=.*[A-Z])(?=.*[\\W_]).{6,}$", user.getPassword())) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Password must contain at least one number, one numeral, and seven characters");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Email already existed. Please try another email");
        }
        if (!Pattern.matches("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", user.getEmail())) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Email is invalid format. Please try again");
        }
        if (userRepository.existsByPhone(user.getPhone())) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Phone number already existed. Please try another phone number");
        }
        if (!Pattern.matches("\\d{10}", user.getPhone())) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Phone number is invalid. Please try again");
        }
        if (!user.isCheckTerm()) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Please check to agree with term and condition");
        }

        User newUser = new User();
        int roleId = user.getRoleSignUpId();
        if (roleId != 1 && roleId != 2 && roleId != 3) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Role id is not valid here!");
        } else {

            Role registerRole = roleRepository.findById(roleId)
                    .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST.value(), "role id is not valid or exist (2 or 3)"));
            newUser.setRoles(Collections.singletonList(registerRole));
        }


        newUser.setName(user.getUsername());
        newUser.setEmail(user.getEmail());
        newUser.setPhone(user.getPhone());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setStatus(UserStatus.NOT_ACTIVE);
        String token = jwtService.createActiveToken(newUser.getEmail());
        newUser.setActiveToken(token);
        userRepository.save(newUser);
        UserImages avatar = new UserImages();
        avatar.setImageUrl("http://localhost:8080/uploads/defaultAvatar.png");
        avatar.setType(UserImageType.AVATAR);
        avatar.setUser(newUser);
        userImagesRepository.save(avatar);
        emailService.sendEmail(
                user.getEmail(),
                "Welcome to Rental Car!",
                "<h1>Thank you for registering!</h1>" +
                        "<p>Your account has been created.</p>" +
                        "<p>Please click the link below to activate your account:</p>" +
                        "<a href='" + "http://localhost:5173/active?token=" + token + "'>Activate your account</a>"
        );
        return "User registered successfully";
    }

    @Override
    public String activate(String token) throws ApiException {
        boolean valid = jwtService.validateToken(token);
        String email = jwtService.getEmailFromToken(token);
        if (!valid) throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Invalid or expired token");
        else {
            User user = userRepository.findByEmail(email);
            if (user == null) {
                throw new ApiException(HttpStatus.BAD_REQUEST.value(), "User not found");
            }
            String activeToken = user.getActiveToken();
            System.out.println(activeToken);
            if (activeToken != null && activeToken.equals(token)) {
                List<Role> userRole = user.getRoles();
                if (userRole.get(0).getId() == 4) {
                    user.setWallet(walletRepository.findByWalletType(UserWalletType.ADMIN_WALLET));
                    user.setStatus(UserStatus.ACTIVE);
                } else {
                    Wallet newWallet = new Wallet();
                    newWallet.setWalletType(UserWalletType.USER_WALLET);
                    newWallet.setBalance(0);
                    walletRepository.save(newWallet);
                    user.setWallet(newWallet);
                    user.setStatus(UserStatus.INACTIVE);
                }
                user.setActiveToken(null);
                userRepository.save(user);
            } else if (activeToken == null) {
                throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Your account was active");
            }
            return "Active account successfully";
        }
    }

    @Override
    public String refresh(String token) throws ApiException {
        String email = jwtService.getEmailFromToken(token);
        User u = userRepository.findByEmail(email);
        if (jwtService.validateToken(token) && !u.getRefreshToken().equals(token)) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Invalid or expired refresh token");
        }
        return jwtService.createToken(u);
    }

    @Override
    public String mailForget(String email) throws ApiException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Invalid email");
        } else {
            String token = jwtService.createActiveToken(email);
            user.setForgotPasswordToken(token);
            userRepository.save(user);
            emailService.sendEmail(
                    user.getEmail(),
                    "Welcome to Rental Car!",
                    "<h1>Forgot password!</h1>" +
                            "<p>Link just exist in 5 minutes</p>" +
                            "<p>If you not create request, just skip this mail" +
                            "<p>Please click the link below to reset your account:</p>" +
                            "<a href='" + "http://localhost:5173/reset?token=" + token + "'> reset your password</a>"
            );
            return "Send forget password email successfully";
        }
    }

    //sau khi nhấn link ở mail thì check token hợp lệ hay ko cho thay đổi mật khẩu
    public String checkForgetToken(String token) throws ApiException {
        boolean valid = jwtService.validateToken(token);
        if (!valid) {
            throw new ApiException(400, "Your token is expired");
        } else {
            return "Token is valid";
        }
    }

    @Override
    public void resetPass(String token, String newPassword) throws ApiException {
        boolean valid = jwtService.validateToken(token);

        if (!valid) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Invalid or expired token");
        } else {
            String email = jwtService.getEmailFromToken(token);
            User user = userRepository.findByEmail(email);

            if (user == null || newPassword.isEmpty()) {
                throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Email or Password is invalid!");
            }
            if (!Pattern.matches("^(?=.*[A-Z])(?=.*[\\W_]).{6,}$", newPassword)) {
                throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Password is invalid format!");
            }
            String forgetToken = user.getForgotPasswordToken();

            if (!user.getForgotPasswordToken().equals(token)) {

                throw new ApiException(400, "Forgot token is invalid");

            } else {
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setForgotPasswordToken(null);
                userRepository.save(user);
            }
        }
    }

    @Override
    public String reActive(String email) {
        User user = userRepository.findByEmail(email);
        String token = jwtService.createActiveToken(email);
        user.setActiveToken(token);
        userRepository.save(user);
        emailService.sendEmail(
                email,
                "Welcome to Rental Car!",
                "<h1>Thank you for registering!</h1>" +
                        "<p>Your account has been created.</p>" +
                        "<p>Please click the link below to activate your account:</p>" +
                        "<a href='" + "http://localhost:5173/active?token=" + token + "'>Activate your account</a>"
        );
        return "Send Email Successfully";
    }


    @Override
    public String logout(String token) throws ApiException {

        boolean isValid = jwtService.validateToken(token);
        if (!isValid) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "invalid token");
        }
        long expiration = jwtService.getExpiration(token);
        redisTemplate.opsForValue().set(token, "blacklisted", Duration.ofMillis(expiration));
        String value = redisTemplate.opsForValue().get(token).toString();
        System.out.println("Stored in Redis: " + value);
        String email = jwtService.getEmailFromToken(token);

        User u = userRepository.findByEmail(email);
        if (u != null) {
            u.setRefreshToken(null);
            userRepository.save(u);
        }
        return "Log out successfully";
    }
}
