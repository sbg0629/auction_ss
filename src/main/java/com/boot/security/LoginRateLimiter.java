package com.boot.security;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class LoginRateLimiter {

    private static final int MAX_ATTEMPTS = 5;
    private static final long LOCK_TIME_MILLIS = 10 * 60 * 1000L; // 10 minutes

    private static class Attempt {
        private int count;
        private long lockedUntil;

        Attempt(int count, long lockedUntil) {
            this.count = count;
            this.lockedUntil = lockedUntil;
        }
    }

    private final Map<String, Attempt> attempts = new ConcurrentHashMap<>();

    public boolean isBlocked(String key) {
        Attempt attempt = attempts.get(key);
        long now = System.currentTimeMillis();
        return attempt != null && attempt.lockedUntil > now;
    }

    public void onSuccess(String key) {
        attempts.remove(key);
    }

    public void onFailure(String key) {
        long now = System.currentTimeMillis();
        attempts.compute(key, (k, prev) -> {
            if (prev == null || prev.lockedUntil < now) {
                return new Attempt(1, 0);
            }

            int newCount = prev.count + 1;
            long lockedUntil = prev.lockedUntil;

            if (newCount >= MAX_ATTEMPTS) {
                lockedUntil = now + LOCK_TIME_MILLIS;
            }

            Attempt updated = new Attempt(newCount, lockedUntil);
            return updated;
        });
    }
}

