package com.youjabroni.youjabronicapstone.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry;
import org.springframework.security.config.annotation.web.socket.AbstractSecurityWebSocketMessageBrokerConfigurer;
import org.springframework.security.config.annotation.web.socket.EnableWebSocketSecurity;
import org.springframework.security.messaging.access.intercept.MessageMatcherDelegatingAuthorizationManager;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

//@Configuration
//public class WebsocketSecurityConfiguration implements WebSocketMessageBrokerConfigurer {
//
//
//    // Dictates which message endpaths are secured and require authentication
//    @Override
//    protected void configureInbound(MessageMatcherDelegatingAuthorizationManager messages) {
//        messages
//                .simpDestMatchers("/secured/**", "/secured/**/**", "/secured/**/**/**").authenticated()
//                .anyMessage().authenticated();
//    }
//}

@Configuration
@EnableWebSocketSecurity
public class WebsocketSecurityConfiguration {

    @Bean
    AuthorizationManager<Message<?>> messageAuthorizationManager(MessageMatcherDelegatingAuthorizationManager.Builder messages) {
        messages
                .simpDestMatchers("/secured/**", "/secured/**/**", "/secured/**/**/**").authenticated()
                .anyMessage().authenticated();
        return messages.build();
    }
}