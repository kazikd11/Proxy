package com.proj.proxy.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;

@Service
public class ProxyService {

    private final RestTemplate restTemplate;
    private final History history;

    public ProxyService(History history) {
        this.history = history;
        this.restTemplate = new RestTemplate();
    }

    public ResponseEntity<String> proxy(String url) {
        String ensuredUrl = ensureProtocol(url);
        System.out.println("Ensured URL: " + ensuredUrl);

        ResponseEntity<String> response = restTemplate.getForEntity(ensuredUrl, String.class);

        if (response.getBody() == null) {
            return ResponseEntity.status(response.getStatusCode()).body(null);
        }

        history.add(ensuredUrl);
        String modifiedBody = modifyLinks(response.getBody(), getBaseLink(ensuredUrl));
//        saveHtmlToFile(modifiedBody);
        return ResponseEntity.ok(modifiedBody);
    }

    private String modifyLinks(String html, String baseUrl) {
        String proxyPrefix = "/proxy?url=";

        System.out.println("Base URL: " + baseUrl);
        html = html.replaceAll("href=\"/", "href=\"" + proxyPrefix + baseUrl+"/");
//        html = html.replaceAll("src=\"/", "src=\"" + proxyPrefix + baseUrl+"/");
        html = html.replaceAll("action=\"/", "action=\"" + proxyPrefix + baseUrl+"/");

        return html;
    }

    private String ensureProtocol(String url) {
        if (url == null || url.isEmpty()) {
            return url;
        }
        return url.startsWith("https://")||url.startsWith("http://") ? url : "https://" + url;
    }

    private String getBaseLink(String url) {
        try {
            URI uri = new URI(url);
            return uri.getScheme() + "://" + uri.getHost();
        } catch (Exception e) {
            return null;
        }
    }
}
