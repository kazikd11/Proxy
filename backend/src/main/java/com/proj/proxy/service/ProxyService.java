package com.proj.proxy.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;

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
        if(response.getBody()==null){
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        }
        history.add(ensuredUrl);
        return ResponseEntity.ok(modifyLinks(response.getBody(), getBaseUrl(ensuredUrl)));
    }

    private String modifyLinks(String html, String baseUrl) {
        String modifiedHtml = html.replaceAll("href=\"/", "href=\"" +"/proxy?url=" + baseUrl + "/");
        modifiedHtml = modifiedHtml.replaceAll("src=\"/", "src=\""+"/proxy?url=" + baseUrl + "/");
        modifiedHtml = modifiedHtml.replaceAll("action=\"/", "action=\""+"/proxy?url=" + baseUrl + "/");
        return modifiedHtml;
    }

    public String getBaseUrl(String url) {
        try {
            URI uri = new URI(url);
            return uri.getScheme() + "://" + uri.getHost();
        } catch (Exception e) {
            return null;
        }
    }

    public static String ensureProtocol(String url) {
        if (url == null || url.isEmpty()) {
            return url;
        }

        if (!url.startsWith("https://")) {
            return "https://" + url;
        }

        return url;
    }
}