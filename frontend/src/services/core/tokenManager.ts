export class TokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private accessTokenExpiresAt: Date | null = null;

  private static readonly STORAGE_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    EXPIRES_AT: 'accessTokenExpiresAt',
  };

  constructor() {
    this.loadFromStorage();
  }

  public saveTokens(accessToken: string, refreshToken: string, expiresInMinutes: number): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.accessTokenExpiresAt = this.calculateExpirationDate(expiresInMinutes);

    localStorage.setItem(TokenManager.STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(TokenManager.STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(TokenManager.STORAGE_KEYS.EXPIRES_AT, this.accessTokenExpiresAt.toISOString());
  }

  public updateAccessToken(accessToken: string, expiresInMinutes: number): void {
    this.accessToken = accessToken;
    this.accessTokenExpiresAt = this.calculateExpirationDate(expiresInMinutes);
    
    localStorage.setItem(TokenManager.STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(TokenManager.STORAGE_KEYS.EXPIRES_AT, this.accessTokenExpiresAt.toISOString());
  }

  public removeTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.accessTokenExpiresAt = null;

    localStorage.removeItem(TokenManager.STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(TokenManager.STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(TokenManager.STORAGE_KEYS.EXPIRES_AT);
  }

  // ===== Token Retrieval =====

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public getRefreshToken(): string | null {
    return this.refreshToken;
  }

  // ===== Token State Checks =====

  public hasTokens(): boolean {
    return !!this.accessToken && !!this.refreshToken;
  }

  public isExpired(): boolean {
    if (!this.accessTokenExpiresAt) return true;
    return new Date() >= this.accessTokenExpiresAt;
  }

  public getTimeUntilExpiration(): number {
    if (!this.accessTokenExpiresAt) return 0;
    return Math.max(0, this.accessTokenExpiresAt.getTime() - new Date().getTime());
  }

  public shouldRefresh(): boolean {
    const timeUntilExpiry = this.getTimeUntilExpiration();
    // Refresh when less than 10 minutes remaining (increased from 5 to avoid CORS issues)
    const tenMinutesInMs = 10 * 60 * 1000;
    return timeUntilExpiry > 0 && timeUntilExpiry < tenMinutesInMs;
  }

  // ===== Private Helpers =====

  private loadFromStorage(): void {
    // Clean up any old tokens with incorrect keys (migration)
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    this.accessToken = localStorage.getItem(TokenManager.STORAGE_KEYS.ACCESS_TOKEN);
    this.refreshToken = localStorage.getItem(TokenManager.STORAGE_KEYS.REFRESH_TOKEN);
    
    const expiresAtStr = localStorage.getItem(TokenManager.STORAGE_KEYS.EXPIRES_AT);
    if (expiresAtStr) {
      this.accessTokenExpiresAt = new Date(expiresAtStr);
    }
  }

  private calculateExpirationDate(expiresInMinutes: number): Date {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);
    return expiresAt;
  }
}

// Singleton instance
export const tokenManager = new TokenManager();

