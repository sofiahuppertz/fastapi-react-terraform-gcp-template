import { tokenManager } from './tokenManager';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

interface RequestConfig extends RequestInit {
  public?: boolean;
  projectScope?: string;
}

export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private buildUrl(path: string, projectScope?: string): string {
    if (projectScope) {
      return `${this.baseUrl}/api/projects/${encodeURIComponent(projectScope)}${path}`;
    }
    return `${this.baseUrl}${path}`;
  }

  public async get<T>(path: string, config: RequestConfig = {}): Promise<T> {
    const { public: isPublic = false, projectScope, ...fetchConfig } = config;
    const url = this.buildUrl(path, projectScope);

    const response = !isPublic
      ? await this.fetchWithAuth(url, { ...fetchConfig, method: 'GET' })
      : await fetch(url, { ...fetchConfig, method: 'GET', credentials: 'include' });

    return this.handleResponse<T>(response);
  }

  public async post<T>(path: string, body?: unknown, config: RequestConfig = {}): Promise<T> {
    const { public: isPublic = false, projectScope, ...fetchConfig } = config;
    const url = this.buildUrl(path, projectScope);
    console.log('url', url);

    // Handle different body types
    let processedBody: string | URLSearchParams | undefined;
    let contentType = 'application/json';

    if (body instanceof URLSearchParams) {
      processedBody = body;
      contentType = 'application/x-www-form-urlencoded';
    } else if (body) {
      processedBody = JSON.stringify(body);
    }

    const requestConfig = {
      ...fetchConfig,
      method: 'POST',
      body: processedBody,
      headers: {
        'Content-Type': contentType,
        ...fetchConfig.headers,
      },
    };

    const response = !isPublic
      ? await this.fetchWithAuth(url, requestConfig)
      : await fetch(url, { ...requestConfig, credentials: 'include' });

    return this.handleResponse<T>(response);
  }

  public async put<T>(path: string, body?: unknown, config: RequestConfig = {}): Promise<T> {
    const { public: isPublic = false, projectScope, ...fetchConfig } = config;
    const url = this.buildUrl(path, projectScope);

    const requestConfig = {
      ...fetchConfig,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...fetchConfig.headers,
      },
    };

    const response = !isPublic
      ? await this.fetchWithAuth(url, requestConfig)
      : await fetch(url, { ...requestConfig, credentials: 'include' });

    return this.handleResponse<T>(response);
  }

  public async patch<T>(path: string, body?: unknown, config: RequestConfig = {}): Promise<T> {
    const { public: isPublic = false, projectScope, ...fetchConfig } = config;
    const url = this.buildUrl(path, projectScope);

    const requestConfig = {
      ...fetchConfig,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...fetchConfig.headers,
      },
    };

    const response = !isPublic
      ? await this.fetchWithAuth(url, requestConfig)
      : await fetch(url, { ...requestConfig, credentials: 'include' });

    return this.handleResponse<T>(response);
  }

  public async delete<T>(path: string, body?: unknown, config: RequestConfig = {}): Promise<T> {
    const { public: isPublic = false, projectScope, ...fetchConfig } = config;
    const url = this.buildUrl(path, projectScope);

    const requestConfig = {
      ...fetchConfig,
      method: 'DELETE',
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...fetchConfig.headers,
      },
    };

    const response = !isPublic
      ? await this.fetchWithAuth(url, requestConfig)
      : await fetch(url, { ...requestConfig, credentials: 'include' });

    return this.handleResponse<T>(response);
  }

  public async streamSSE(
    path: string,
    onMessage: (data: string) => void,
    onError: (error: Error) => void,
    config: RequestConfig = {}
  ): Promise<() => void> {
    const { public: isPublic = false, projectScope, ...fetchConfig } = config;
    const url = this.buildUrl(path, projectScope);

    const requestConfig = {
      ...fetchConfig,
      method: 'GET',
      headers: {
        Accept: 'text/event-stream',
        ...fetchConfig.headers,
      },
    };

    const response = !isPublic
      ? await this.fetchWithAuth(url, requestConfig)
      : await fetch(url, { ...requestConfig, credentials: 'include' });

    if (!response.ok || !response.body) {
      throw new Error(`Failed to connect: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    const processStream = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              onMessage(data);
            }
          }
        }
      } catch (error) {
        onError(error as Error);
      }
    };
    processStream();
    return () => reader.cancel();
  }

  public async fetchWithAuth(
    url: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<Response> {
    // Proactively refresh token if it's expired or about to expire (within 5 minutes)
    if ((tokenManager.isExpired() || tokenManager.shouldRefresh()) && retryCount === 0) {
      const refreshToken = tokenManager.getRefreshToken();
      if (refreshToken) {
        try {
          await this.refreshAccessToken(refreshToken);
        } catch {
          // If proactive refresh fails and token is already expired, throw
          if (tokenManager.isExpired()) {
            tokenManager.removeTokens();
            throw new Error('Session expired - please log in again');
          }
          // Otherwise continue with current token, reactive refresh will handle it
        }
      }
    }

    const accessToken = tokenManager.getAccessToken();

    if (!accessToken) {
      tokenManager.removeTokens();
      throw new Error('No access token available');
    }

    // Add authorization header
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      // Make the request
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      // If unauthorized and we have a refresh token, try to refresh once
      if (response.status === 401 && retryCount === 0) {
        const refreshToken = tokenManager.getRefreshToken();

        if (!refreshToken) {
          tokenManager.removeTokens();
          throw new Error('Session expired');
        }

        try {
          // Attempt to refresh the token
          await this.refreshAccessToken(refreshToken);

          // Retry the original request with new access token (only once)
          return this.fetchWithAuth(url, options, retryCount + 1);
        } catch (error) {
          tokenManager.removeTokens();
          throw new Error('Session expired');
        }
      }

      // If still unauthorized after retry, session is expired
      if (response.status === 401 && retryCount > 0) {
        tokenManager.removeTokens();
        throw new Error('Session expired - please log in again');
      }

      return response;
    } catch (error) {
      // Detect CORS errors (TypeError with 'Failed to fetch' typically indicates CORS)
      // This often happens when backend returns 401 without CORS headers
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        // If we haven't retried yet and have a refresh token, try refreshing
        // This handles the case where backend 401 responses lack CORS headers
        if (retryCount === 0) {
          const refreshToken = tokenManager.getRefreshToken();
          if (refreshToken) {
            console.warn(`⚠️ Network error for ${options.method} ${url} - attempting token refresh (may be auth issue masquerading as CORS)`);
            try {
              await this.refreshAccessToken(refreshToken);
              // Retry with new token
              return this.fetchWithAuth(url, options, retryCount + 1);
            } catch {
              // Refresh failed - likely session truly expired
              tokenManager.removeTokens();
              throw new Error('Session expired - please log in again');
            }
          }
        }

        // If no refresh token or already retried, it's a genuine CORS/network error
        console.error(`❌ Network/CORS Error for ${options.method} ${url}`);
        tokenManager.removeTokens();
        throw new Error('Session expired - please log in again');
      }
      throw error;
    }
  }


  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      console.error(`❌ HTTP Error ${response.status} for ${response.url}:`, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    if (response.status === 204 || response.status === 205) {
      return undefined as T;
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    const text = await response.text();
    return text as T;
  }

  public async refreshAccessToken(refreshToken: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const refreshResponse = await response.json();
    tokenManager.updateAccessToken(refreshResponse.access_token, refreshResponse.expires_in);
  }
}

