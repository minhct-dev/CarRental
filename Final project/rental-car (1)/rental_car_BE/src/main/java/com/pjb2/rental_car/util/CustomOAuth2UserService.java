//package com.pjb2.rental_car.util;
//
//import com.pjb2.rental_car.dto.request.BookingRequestDTO;
//import com.pjb2.rental_car.dto.request.RegisterUserDTO;
//import com.pjb2.rental_car.dto.request.UserRequestDTO;
//import com.pjb2.rental_car.entity.Role;
//import com.pjb2.rental_car.entity.User;
//import com.pjb2.rental_car.entity.UserImages;
//import com.pjb2.rental_car.exception.ApiException;
//import com.pjb2.rental_car.repository.RoleRepository;
//import com.pjb2.rental_car.repository.UserImagesRepository;
//import com.pjb2.rental_car.repository.UserRepository;
//import com.pjb2.rental_car.service.AuthService;
//import com.pjb2.rental_car.service.EmailService;
//import com.pjb2.rental_car.service.UserService;
//import com.pjb2.rental_car.util.common.UserImageType;
//import com.pjb2.rental_car.util.common.UserStatus;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
//import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
//import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
//import com.pjb2.rental_car.repository.UserRepository;
//import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
//import org.springframework.security.oauth2.core.user.OAuth2User;
//import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
//import org.springframework.stereotype.Service;
//
//import java.io.IOException;
//import java.util.Collections;
//
//@Service
//@RequiredArgsConstructor
//public class CustomOAuth2UserService implements AuthenticationSuccessHandler {
//    private final JwtService jwtService;
//    private final UserRepository userRepository;
//    private final RoleRepository roleRepository;
//    private final UserDetailService userDetailService;
//    private final EmailService  emailService;
//    private final UserImagesRepository userImagesRepository;
//
//    @Override
//    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
//        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
//
//        // Lấy thông tin từ Google
//        String email = oAuth2User.getAttribute("email");
//        String name = oAuth2User.getAttribute("name");
//
//        // Kiểm tra xem user đã tồn tại trong DB hay chưa
//        User existingUser = userRepository.findByEmail(email);
//        if (existingUser == null) {
//            Role registerRole = roleRepository.findById(1).orElseThrow();
//            // Nếu chưa có user, tạo mới
//            existingUser = new User();
//            existingUser.setEmail(email);
//            existingUser.setName(name);
//            existingUser.setStatus(UserStatus.INACTIVE);
//            String token = jwtService.generateActiveToken(existingUser.getEmail());
//            existingUser.setActiveToken(token);
//            existingUser.setRoles(Collections.singletonList(registerRole));
//            userRepository.save(existingUser);
//            UserImages avatar = new UserImages();
//            avatar.setImageUrl("http://localhost:8080/uploads/defaultAvatar.png");
//            avatar.setType(UserImageType.AVATAR);
//            avatar.setUser(existingUser);
//            userImagesRepository.save(avatar);
//        }
//
//        String accessToken = jwtService.generateAccessToken(email);
//        String refreshToken = jwtService.generateRefreshToken(email);
//
//        existingUser.setRefreshToken(refreshToken);
//        userRepository.save(existingUser);
//
//
//
//        UserDetails c = null;
//        Authentication auth =new UsernamePasswordAuthenticationToken(c,null,c.getAuthorities());
//        SecurityContextHolder.getContext().setAuthentication(auth);
//        response.setContentType("application/json");
//        response.getWriter().write("{\"accessToken\": \"" + accessToken + "\", \"refreshToken\": \"" + refreshToken + "\"}");
//    }
//}
