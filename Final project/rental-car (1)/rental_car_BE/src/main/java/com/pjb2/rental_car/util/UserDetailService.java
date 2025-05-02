package com.pjb2.rental_car.util;

import com.pjb2.rental_car.repository.RoleRepository;
import com.pjb2.rental_car.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component("userDetailsService")
@RequiredArgsConstructor
public class UserDetailService implements UserDetailsService {
    private final UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        com.pjb2.rental_car.entity.User u = userRepository.findByEmail(username);
        if (u == null) {
            throw new UsernameNotFoundException(username);
        }

        // Lấy danh sách các role từ đối tượng User và chuyển đổi chúng thành SimpleGrantedAuthority
        List<SimpleGrantedAuthority> authorities = u.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());

        // Tạo đối tượng UserDetails với danh sách các quyền (authorities)
        return new org.springframework.security.core.userdetails.User(
                u.getEmail(),
                u.getPassword(),
                authorities);
    }
}

