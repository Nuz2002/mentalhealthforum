package com.example.ForumBackend.controller;

import com.example.ForumBackend.service.PresenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/presence")
@RequiredArgsConstructor
public class PresenceRestController {

    private final PresenceService presenceService;

    @GetMapping("/online-users")
    public Set<String> getOnlineUsers() {
        return presenceService.getAllOnline();
    }
}
