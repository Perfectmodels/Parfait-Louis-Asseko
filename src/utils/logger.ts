/**
 * Secure logging utility that prevents sensitive data exposure in production
 * Only logs to console in development mode
 */

const isDevelopment = import.meta.env.DEV;

/**
 * Sanitize data to remove sensitive information
 */
const sanitizeData = (data: any): any => {
    if (!data) return data;

    // If it's a string, check for sensitive patterns
    if (typeof data === 'string') {
        // Don't log if it contains potential API keys or tokens
        if (data.match(/api[_-]?key|token|secret|password|auth/i)) {
            return '[REDACTED]';
        }
        return data;
    }

    // If it's an object, sanitize each property
    if (typeof data === 'object') {
        const sanitized: any = Array.isArray(data) ? [] : {};

        for (const key in data) {
            // Redact sensitive keys
            if (key.match(/password|secret|token|api[_-]?key|auth|credential/i)) {
                sanitized[key] = '[REDACTED]';
            } else {
                sanitized[key] = sanitizeData(data[key]);
            }
        }

        return sanitized;
    }

    return data;
};

/**
 * Safe console.log that only works in development
 */
export const safeLog = (...args: any[]): void => {
    if (isDevelopment) {
        console.log(...args.map(sanitizeData));
    }
};

/**
 * Safe console.error that sanitizes sensitive data even in production
 */
export const safeError = (...args: any[]): void => {
    if (isDevelopment) {
        console.error(...args);
    } else {
        // In production, log sanitized errors
        console.error(...args.map(sanitizeData));
    }
};

/**
 * Safe console.warn that only works in development
 */
export const safeWarn = (...args: any[]): void => {
    if (isDevelopment) {
        console.warn(...args);
    }
};

/**
 * Log only in development mode
 */
export const devLog = (...args: any[]): void => {
    if (isDevelopment) {
        console.log('[DEV]', ...args);
    }
};

/**
 * Log errors with context but sanitize in production
 */
export const logError = (context: string, error: any): void => {
    if (isDevelopment) {
        console.error(`[${context}]`, error);
    } else {
        // In production, log minimal sanitized info
        console.error(`[${context}]`, error?.message || 'An error occurred');
    }
};

export default {
    log: safeLog,
    error: safeError,
    warn: safeWarn,
    dev: devLog,
    logError
};
