package com.mita.auth.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class FrontendUrlResolver {

    private static final Set<String> BUILT_IN_ALLOWED_ORIGINS = Set.of(
            "https://mitaedu.com",
            "https://www.mitaedu.com",
            "https://staging.mitaedu.com"
    );

    private final String fallbackFrontendUrl;
    private final Set<String> allowedOrigins;

    public FrontendUrlResolver(
            @Value("${app.frontend-url}") String fallbackFrontendUrl,
            @Value("${app.cors.allowed-origins}") String allowedOrigins) {
        this.fallbackFrontendUrl = normalizeOrigin(fallbackFrontendUrl);
        this.allowedOrigins = Arrays.stream(allowedOrigins.split(","))
                .map(FrontendUrlResolver::normalizeOrigin)
                .filter(origin -> !origin.isBlank())
                .collect(Collectors.toSet());
        this.allowedOrigins.addAll(BUILT_IN_ALLOWED_ORIGINS);
    }

    public String resolve(String originHeader, String refererHeader) {
        String origin = normalizeOrigin(originHeader);
        if (allowedOrigins.contains(origin)) {
            return origin;
        }

        origin = originFromReferer(refererHeader);
        if (allowedOrigins.contains(origin)) {
            return origin;
        }

        return fallbackFrontendUrl;
    }

    private static String originFromReferer(String referer) {
        try {
            URI uri = URI.create(referer == null ? "" : referer.trim());
            if (uri.getScheme() == null || uri.getHost() == null) {
                return "";
            }
            String port = uri.getPort() == -1 ? "" : ":" + uri.getPort();
            return normalizeOrigin(uri.getScheme() + "://" + uri.getHost() + port);
        } catch (IllegalArgumentException ex) {
            return "";
        }
    }

    private static String normalizeOrigin(String value) {
        if (value == null) {
            return "";
        }
        String origin = value.trim();
        while (origin.endsWith("/")) {
            origin = origin.substring(0, origin.length() - 1);
        }
        return origin;
    }
}
