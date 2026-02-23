import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";
import { User } from "@/lib/types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await getCurrentUser();
        setUser(userData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch user");
        setUser(null);
        removeToken();
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const logout = () => {
    removeToken();
    setUser(null);
  };

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === "admin";

  return { user, isLoading, error, logout, isAuthenticated, isAdmin };
}
