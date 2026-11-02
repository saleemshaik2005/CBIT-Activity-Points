/**
 * Resilient AI Service Circuit Breaker
 * Protects system from external LLM / OCR service cascading failures and rate-limit exhaustion.
 * States:
 *   - CLOSED: Normal operation
 *   - OPEN: External service failing / rate-limited; jobs routed to Graceful Manual Review Queue
 *   - HALF_OPEN: Cooldown expired; allowing 1 trial probe call
 */

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerConfig {
  failureThreshold: number; // Consecutive failures to trip breaker
  cooldownPeriodMs: number; // Milliseconds before testing recovery
  timeoutMs: number;        // Individual request timeout limit
}

export class AICircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private consecutiveFailures = 0;
  private lastFailureTime = 0;
  private openedAt = 0;
  private totalCalls = 0;
  private totalTrips = 0;
  private config: CircuitBreakerConfig;

  constructor(config?: Partial<CircuitBreakerConfig>) {
    this.config = {
      failureThreshold: config?.failureThreshold ?? 3,
      cooldownPeriodMs: config?.cooldownPeriodMs ?? 60 * 1000, // 60 seconds cooldown
      timeoutMs: config?.timeoutMs ?? 35 * 1000,               // 35 seconds timeout
    };
  }

  public getState(): CircuitState {
    const now = Date.now();
    if (this.state === 'OPEN') {
      if (now - this.openedAt >= this.config.cooldownPeriodMs) {
        this.state = 'HALF_OPEN';
        console.warn('[Circuit Breaker] Cooldown elapsed. Entering HALF_OPEN state (probing AI service).');
      }
    }
    return this.state;
  }

  public canExecute(): boolean {
    const currentState = this.getState();
    return currentState === 'CLOSED' || currentState === 'HALF_OPEN';
  }

  public recordSuccess(): void {
    this.totalCalls++;
    if (this.state === 'HALF_OPEN') {
      console.log('[Circuit Breaker] Probe call succeeded! Resetting circuit breaker to CLOSED.');
    }
    this.consecutiveFailures = 0;
    this.state = 'CLOSED';
  }

  public recordFailure(isRateLimit = false): void {
    this.totalCalls++;
    this.consecutiveFailures++;
    this.lastFailureTime = Date.now();

    // If rate limited (HTTP 429), trip immediately to protect quota
    if (isRateLimit || this.consecutiveFailures >= this.config.failureThreshold) {
      this.state = 'OPEN';
      this.openedAt = Date.now();
      this.totalTrips++;
      console.error(
        `[Circuit Breaker] TRIPPED to OPEN! Consecutive failures: ${this.consecutiveFailures}. Cooldown: ${
          this.config.cooldownPeriodMs / 1000
        }s.`
      );
    }
  }

  public getStatusReport() {
    return {
      state: this.getState(),
      consecutiveFailures: this.consecutiveFailures,
      totalCalls: this.totalCalls,
      totalTrips: this.totalTrips,
      lastFailureTime: this.lastFailureTime > 0 ? new Date(this.lastFailureTime).toISOString() : null,
      cooldownSecondsRemaining:
        this.state === 'OPEN'
          ? Math.max(0, Math.ceil((this.openedAt + this.config.cooldownPeriodMs - Date.now()) / 1000))
          : 0,
    };
  }
}

// Global Singleton Circuit Breaker for Gemini Document Intelligence
export const geminiCircuitBreaker = new AICircuitBreaker();
