package com.youjabroni.youjabronicapstone.controllers;

import com.youjabroni.youjabronicapstone.services.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class KeysController {

    @Autowired
    private Keys keys;

    @GetMapping(value = "/keys.js", produces = "application/javascript")
    public String getKeys(){
        return String.format("""
                const FILESTACK_API_KEY = "%s";
                """, keys.getFILESTACK_API_KEY());
    }
}
