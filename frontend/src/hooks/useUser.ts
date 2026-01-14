import { useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLocalStorage } from "./useLocalStorage";

// NOTE: optimally move this into a separate file
export interface User {
  email: string;
}

export const useUser = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useUser must be used within an AuthProvider');
  }
  
  const { user, setUser } = context;
  const { setItem } = useLocalStorage();

  const addUser = useCallback((user: User) => {
    setUser(user);
    setItem("user", JSON.stringify(user));
  }, [setUser, setItem]);

  const removeUser = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
  }, [setUser]);

  return { user, addUser, removeUser, setUser };
};