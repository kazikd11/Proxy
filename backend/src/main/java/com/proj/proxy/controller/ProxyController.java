package com.proj.proxy.controller;

import com.proj.proxy.service.History;
import com.proj.proxy.service.ProxyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProxyController {

    private final ProxyService proxyService;
    private final History history;

    public ProxyController(ProxyService proxyService, History history) {
        this.proxyService = proxyService;
        this.history = history;
    }

    @GetMapping("/proxy")
    public ResponseEntity<String> proxyRequest(@RequestParam String url) {
        System.out.println("URL: " + url);
        if (url == null || url.isEmpty()) {
            return ResponseEntity.badRequest().body("URL is required");
        }
        history.add(url);
        return proxyService.proxy(url);
    }

    @GetMapping("/next")
    public ResponseEntity<String> nextRequest() {
        return history.next();
    }

    @GetMapping("/previous")
    public ResponseEntity<String> previousRequest() {
        return history.previous();
    }
}
