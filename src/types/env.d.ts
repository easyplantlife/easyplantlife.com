/**
 * Environment variable type definitions for Easy Plant Life
 *
 * This file extends the NodeJS.ProcessEnv interface to provide
 * type-safe access to environment variables throughout the application.
 *
 * Variable naming conventions:
 * - NEXT_PUBLIC_* : Available in both server and client contexts
 * - All others    : Server-only (not exposed to browser)
 */

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * Google Analytics 4 Measurement ID
     * Format: G-XXXXXXXXXX
     * Context: Client-side (NEXT_PUBLIC_ prefix)
     * Used for: Browser analytics tracking
     */
    NEXT_PUBLIC_GA_MEASUREMENT_ID?: string;

    /**
     * Resend API Key
     * Context: Server-only (never expose to client)
     * Used for: Sending newsletter signups and contact form emails
     */
    RESEND_API_KEY?: string;

    /**
     * Medium Publication URL
     * Format: https://medium.com/@publication or https://publication.medium.com
     * Context: Server-only
     * Used for: Fetching blog excerpts via RSS
     */
    MEDIUM_PUBLICATION_URL?: string;
  }
}
