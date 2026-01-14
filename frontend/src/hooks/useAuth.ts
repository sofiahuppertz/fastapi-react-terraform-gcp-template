import { useEffect, useCallback, useRef } from "react";
import { useUser, User } from "./useUser";
import { tokenManager } from "../services/core/tokenManager";
import { HttpClient } from "../services/core/HTTPClient";

const httpClient = new HttpClient();

export const useAuth = () => {
  const { user, addUser, removeUser, setUser } = useUser();
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const logout = useCallback(() => {
    removeUser();
    tokenManager.removeTokens();
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
  }, [removeUser]);

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = tokenManager.getRefreshToken();
    
    if (!refreshToken) {
      logout();
      return false;
    }

    try {
      await httpClient.refreshAccessToken(refreshToken);
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      return false;
    }
  }, [logout]);

  const scheduleTokenRefresh = useCallback(() => {
    // Clear any existing timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }

    if (!tokenManager.hasTokens()) {
      logout();
      return;
    }

    const timeUntilExpiration = tokenManager.getTimeUntilExpiration();
    const fiveMinutesInMs = 5 * 60 * 1000;

    console.log(`[Token Refresh] Time until expiration: ${Math.floor(timeUntilExpiration / 1000 / 60)} minutes`);

    // If already expired or expiring very soon, refresh immediately
    if (timeUntilExpiration <= fiveMinutesInMs) {
      console.log('[Token Refresh] Token expiring soon or expired, refreshing immediately');
      refreshAccessToken().then((success) => {
        if (success) {
          console.log('[Token Refresh] Token refreshed successfully, scheduling next refresh');
          // Schedule the next refresh after this one succeeds
          scheduleTokenRefresh();
        }
      });
      return;
    }

    // Schedule refresh for 5 minutes before expiration
    const timeUntilRefresh = timeUntilExpiration - fiveMinutesInMs;
    console.log(`[Token Refresh] Scheduling refresh in ${Math.floor(timeUntilRefresh / 1000 / 60)} minutes`);
    
    refreshTimeoutRef.current = setTimeout(async () => {
      console.log('[Token Refresh] Executing scheduled token refresh');
      const success = await refreshAccessToken();
      if (success) {
        console.log('[Token Refresh] Scheduled refresh successful, scheduling next refresh');
        // Schedule the next refresh after this one succeeds
        scheduleTokenRefresh();
      }
    }, timeUntilRefresh);
  }, [logout, refreshAccessToken]);

  // Initial setup and user restoration from localStorage
  useEffect(() => {
    if (!user && tokenManager.hasTokens()) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Failed to parse stored user:", error);
          localStorage.removeItem("user");
          tokenManager.removeTokens();
        }
      }
    }
  }, [user, setUser]);

  // Separate effect to handle token refresh scheduling
  useEffect(() => {
    if (user && tokenManager.hasTokens()) {
      // Check if token needs immediate refresh
      if (tokenManager.isExpired() || tokenManager.shouldRefresh()) {
        refreshAccessToken().then((success) => {
          if (success) {
            scheduleTokenRefresh();
          }
        });
      } else {
        scheduleTokenRefresh();
      }
    }

    // Cleanup on unmount or when user logs out
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Only re-run when user changes, not when callbacks change

  const login = (user: User) => {
    addUser(user);
    scheduleTokenRefresh();
  };

  return { user, login, logout, setUser };
};
