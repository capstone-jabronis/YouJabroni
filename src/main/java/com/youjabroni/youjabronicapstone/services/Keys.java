package com.youjabroni.youjabronicapstone.services;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Getter
@Setter
@Service
public class Keys {
    @Value("${FILESTACK.API.KEY}")
    private String FILESTACK_API_KEY;
}
