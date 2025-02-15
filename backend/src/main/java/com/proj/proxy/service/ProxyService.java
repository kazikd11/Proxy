package com.proj.proxy.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;

@Service
public class ProxyService {

    private final RestTemplate restTemplate;

    public ProxyService() {
        this.restTemplate = new RestTemplate();
    }

    public ResponseEntity<String> proxy(String url) {
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        System.out.println("Response from " + url + ": " + response.getBody());
        if(response.getBody()==null){
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        }
        return ResponseEntity.ok(modifyLinks(response.getBody(), getBaseUrl(url)));
    }

    public ResponseEntity<String> proxy(String url, String body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        return ResponseEntity.ok(response.getBody());
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
}