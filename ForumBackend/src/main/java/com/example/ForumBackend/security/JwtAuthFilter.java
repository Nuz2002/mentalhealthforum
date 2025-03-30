package com.example.ForumBackend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // 1) Check if the request path is one of the public endpoints.
        String requestURI = request.getRequestURI();
        System.out.println(">>> doFilterInternal called for URI: " + requestURI);

        if (isPublicEndpoint(requestURI)) {
            System.out.println(">>> Public endpoint: letting request pass");
            filterChain.doFilter(request, response);
            return;
        }

        // 2) For all other paths, do the usual JWT checks.
        try {
            String jwt = parseJwt(request);
            if (jwt != null && jwtUtil.validateAccessToken(jwt)) {
                // The subject of the token is the user's email
                String email = jwtUtil.getEmailFromAccessToken(jwt);

                // Load the user by email
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        } catch (Exception e) {
            System.out.println("Cannot set user authentication: " + e.getMessage());
        }

        // 3) Continue the filter chain for all other endpoints
        filterChain.doFilter(request, response);
    }

    private boolean isPublicEndpoint(String requestURI) {
        return requestURI.startsWith("/api/auth/register")
                || requestURI.startsWith("/api/auth/login")
                || requestURI.startsWith("/api/auth/verify-email")
                || requestURI.startsWith("/api/auth/forgot-password")
                || requestURI.startsWith("/api/auth/reset-password");
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}
