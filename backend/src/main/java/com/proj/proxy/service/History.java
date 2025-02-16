package com.proj.proxy.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;

@Service
public class History {

        private int counter = 0;

        List<String> historyList = new LinkedList<>();

        public void add(String url) {
            historyList.add(url);
            counter=historyList.size()-1;
        }

        public ResponseEntity<String> next() {
            if(counter==historyList.size()-1){
                return ResponseEntity.badRequest().body("{\"error\": \"No more history\"}");
            }
            counter++;
            String nextUrl = historyList.get(counter);
            return ResponseEntity.ok("{\"url\": \"" + nextUrl + "\"}");
        }

        public ResponseEntity<String> previous() {
            if(counter==0){
                return ResponseEntity.badRequest().body("{\"error\": \"No more history\"}");
            }
            counter--;
            String prevUrl = historyList.get(counter);
            return ResponseEntity.ok("{\"url\": \"" + prevUrl + "\"}");
        }
}
