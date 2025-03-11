package com.proj.proxy.controller;

import com.proj.proxy.service.ProxyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ProxyController {

    private final ProxyService proxyService;

    public ProxyController(ProxyService proxyService) {
        this.proxyService = proxyService;

    }

    @GetMapping("/proxy")
    public ResponseEntity<String> proxyRequest(@RequestParam String url) {
        System.out.println("URL: " + url);
        if (url == null || url.isEmpty()) {
            return ResponseEntity.badRequest().body("URL is required");
        }
        return proxyService.proxy(url);
    }

}
