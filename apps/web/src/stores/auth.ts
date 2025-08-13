import { getMenuData } from "@/components/layout/data/sidebar-data";
import {
  getMenu,
  getProfile,
  login,
  logout,
  register,
  sendEmail,
} from "@/service/xhr/user";
import type {
  MenuResponse,
  SendNotificationResponse,
  User,
} from "@recruitment/schema";
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
  menus: MenuResponse[] | null;
  defaultPath: string; // 新增：默认路径
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

  getMenus: () => Promise<any>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    emailVerificationCode: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  initialLoader: () => Promise<User>;
  sendVerificationCode: (email: string) => Promise<SendNotificationResponse>;

  isSuperAdmin: () => boolean;
}

// 用于缓存 initialLoader 的 Promise，避免重复请求
let initPromise: Promise<User> | null = null;

export const authStore = createStore<AuthState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  menus: null,
  defaultPath: getMenuData("perm-todo-manage")?.path!, // 默认路径
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

  getMenus: async () => {
    const res = await getMenu();
    const { data } = res;
    let defaultPath = getMenuData("perm-todo-manage")?.path!; // 默认路径
    // 设置默认路径为第一个菜单的路径
    if (data && data.length > 0) {
      if (data[0].children && data[0].children.length > 0) {
        defaultPath = getMenuData(data[0].children[0].id)!.path!;
      } else {
        defaultPath = getMenuData(data[0].id)!.path!;
      }
    }
    set({
      menus: data,
      defaultPath,
    });
  },

  login: async (credentials) => {
    try {
      set({ isLoading: true });

      const res = await login(credentials);
      const { data } = res;
      set({ user: data!.user, isAuthenticated: true, isInitialized: true });
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (registerData) => {
    try {
      set({ isLoading: true });
      await register(registerData);
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      set({ user: null, isAuthenticated: false, isInitialized: true });
      // 清除可能存在的初始化 Promise
      initPromise = null;
    }
  },

  sendVerificationCode: async (email) => {
    const response = await sendEmail(email);
    return response.data!;
  },

  isSuperAdmin: () => {
    const user = get().user;
    return !!user?.roles?.some((role) => role.code === "SUPER_ADMIN");
  },
}));

const createSelectors = <S extends StoreApi<object>>(_store: S) => {
  const useBoundStore: any = (selector?: any) => useStore(authStore, selector);

  Object.assign(useBoundStore, authStore);

  return useBoundStore as UseBoundStore<StoreApi<AuthState>>;
};

export const useAuthStore = createSelectors(authStore);
