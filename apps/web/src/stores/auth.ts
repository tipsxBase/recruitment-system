import { create } from "zustand";

// 由于 schema 包在 packages 中，我们需要直接引用类型定义
interface User {
  id: string;
  username: string;
  email?: string;
  emailVerified: boolean;
  employeeNo?: string;
  phone?: string;
  status: string;
  department?: {
    id: string;
    name: string;
    parent?: {
      id: string;
      name: string;
    };
  };
  roles: Array<{
    id: string;
    name: string;
    code: string;
    description?: string;
  }>;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;

  // API calls
  login: (credentials: {
    username: string;
    password: string;
    rememberMe?: boolean;
  }) => Promise<void>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    emailVerificationCode: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  sendVerificationCode: (
    email: string
  ) => Promise<{ success: boolean; message: string; expiresIn: number }>;
}

const API_BASE_URL = "http://localhost:8080/api";

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user) => set({ user, isAuthenticated: true }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
  setLoading: (isLoading) => set({ isLoading }),

  login: async (credentials) => {
    try {
      set({ isLoading: true });

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 重要：包含 cookies
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "登录失败");
      }

      const data = await response.json();
      set({ user: data.user, isAuthenticated: true });
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (registerData) => {
    try {
      set({ isLoading: true });

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "注册失败");
      }

      const data = await response.json();
      // 注册成功后不自动登录，让用户手动登录
      return data;
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },

  getCurrentUser: async () => {
    try {
      set({ isLoading: true });

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        credentials: "include",
      });

      if (response.ok) {
        const user = await response.json();
        set({ user, isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (error) {
      console.error("Get current user error:", error);
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  sendVerificationCode: async (email) => {
    const response = await fetch(
      `${API_BASE_URL}/auth/send-verification-code`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "发送验证码失败");
    }

    return response.json();
  },
}));
