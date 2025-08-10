import { getProfile } from "@/service/xhr/user";
import type { User } from "@recruitment/schema";
import {
  createStore,
  useStore,
  type StoreApi,
  type UseBoundStore,
} from "zustand";

interface GlobalState {
  user: User | null;
  isAuthenticated: boolean;
  initialLoader: () => void;
}

const globalStore = createStore<GlobalState>()((set, get) => ({
  user: null,
  isAuthenticated: false,

  // 初始化请求方法，会在应用启动时调用，
  initialLoader: () => {
    getProfile().then((res) => {
      // 用户已登录
      const { data } = res;
      set({ user: data, isAuthenticated: true }); // 设置用户信息和认证状态
    });
  },
}));

export default globalStore;

const createSelectors = <S extends StoreApi<object>>(_store: S) => {
  const useBoundStore: any = (selector?: any) =>
    useStore(globalStore, selector);

  Object.assign(useBoundStore, globalStore);

  return useBoundStore as UseBoundStore<StoreApi<GlobalState>>;
};

export const useGlobalStore = createSelectors(globalStore);
