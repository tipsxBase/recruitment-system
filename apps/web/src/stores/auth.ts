import { getProfile } from "@/service/xhr/user";
import type { User } from "@recruitment/schema";
import {
  createStore,
  useStore,
  type StoreApi,
  type UseBoundStore,
} from "zustand";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean; // 新增：标记是否已经初始化过

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
  initialLoader: () => Promise<User>;
  sendVerificationCode: (
    email: string
  ) => Promise<{ success: boolean; message: string; expiresIn: number }>;
}

const API_BASE_URL = "http://localhost:8080/api";

// 用于缓存 initialLoader 的 Promise，避免重复请求
let initPromise: Promise<User> | null = null;

export const authStore = createStore<AuthState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  setUser: (user) => set({ user, isAuthenticated: true, isInitialized: true }),
  clearUser: () =>
    set({ user: null, isAuthenticated: false, isInitialized: true }),
  setLoading: (isLoading) => set({ isLoading }),

  // 初始化请求方法，会在应用启动时调用
  initialLoader: () => {
    const state = get();

    // 如果已经初始化过且不在加载中，直接返回当前用户信息
    if (state.isInitialized && !state.isLoading) {
      return state.user
        ? Promise.resolve(state.user)
        : Promise.reject(new Error("User not authenticated"));
    }

    // 如果已经有正在进行的初始化请求，返回该 Promise
    if (initPromise) {
      return initPromise;
    }

    set({ isLoading: true });

    initPromise = getProfile()
      .then((res) => {
        // 用户已登录
        const { data } = res;
        set({ user: data, isAuthenticated: true, isInitialized: true });
        return data!; // 返回用户信息
      })
      .catch((error) => {
        // 用户未登录或请求失败
        set({ user: null, isAuthenticated: false, isInitialized: true });
        throw error;
      })
      .finally(() => {
        set({ isLoading: false });
        initPromise = null; // 清除缓存的 Promise
      });

    return initPromise;
  },

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
      set({ user: data.user, isAuthenticated: true, isInitialized: true });
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
      set({ user: null, isAuthenticated: false, isInitialized: true });
      // 清除可能存在的初始化 Promise
      initPromise = null;
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

const createSelectors = <S extends StoreApi<object>>(_store: S) => {
  const useBoundStore: any = (selector?: any) => useStore(authStore, selector);

  Object.assign(useBoundStore, authStore);

  return useBoundStore as UseBoundStore<StoreApi<AuthState>>;
};

export const useAuthStore = createSelectors(authStore);
