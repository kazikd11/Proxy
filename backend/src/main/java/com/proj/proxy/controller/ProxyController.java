package com.proj.proxy.controller;

import com.proj.proxy.service.ProxyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class ProxyController {

    private final ProxyService proxyService;

    public ProxyController(ProxyService proxyService) {
        this.proxyService = proxyService;
    }

    @GetMapping("/proxy")
    public ResponseEntity<String> proxyRequest(@RequestParam String url) {
        if (url == null || url.isEmpty()) {
            return ResponseEntity.badRequest().body("URL is required");
        }
        return proxyService.proxy(url);
    }

    @PostMapping("/proxy")
    public ResponseEntity<String> proxyPostRequest(@RequestParam String url, @RequestBody String body) {
        if (url == null || url.isEmpty()) {
            return ResponseEntity.badRequest().body("URL is required");
        }
        return proxyService.proxy(url, body);
    }
}
