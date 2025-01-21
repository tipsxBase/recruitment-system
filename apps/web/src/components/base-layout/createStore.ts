"use client";
/* eslint-disable react-hooks/rules-of-hooks */
import { MenuEntity, UserEntity } from "@recruitment/schema/interface";
import {
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
} from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
export interface MenuFiber {
  key: string;
  raw: MenuEntity;
  return: MenuFiber | null;
  child: MenuFiber | null;
  sibling: MenuFiber | null;
}

export interface MenuRoot {
  key: string;
  child: MenuFiber | null;
}

export type MenuURL = string;
export type MenuKey = string;

interface FiberIndex {
  key: string;
  label: string;
}

export interface MenuSearchIndex {
  search: string;
  key: string;
  display: string;
  url: string;
}

const generateMenuIndex = (
  menuFiber: MenuFiber,
  url: string,
  menuKey: string
) => {
  const menuIndex: FiberIndex[] = [];
  let fiber = menuFiber;
  while (fiber) {
    const { raw, key } = fiber;
    const fiberIndex: FiberIndex = {
      key,
    } as FiberIndex;
    if (fiber.raw.name) {
      fiberIndex.label = raw.name;
    }

    menuIndex.push(fiberIndex);
    fiber = fiber.return;
  }
  const searchMenu = menuIndex.reduceRight(
    (prev, current) => {
      if (prev.search) {
        prev.search = prev.search + current.label;
        prev.display = prev.display + "/" + current.label;
      } else {
        prev.search = current.label;
        prev.display = current.label;
      }
      return prev;
    },
    {} as Record<string, string>
  );
  searchMenu.key = menuKey;
  searchMenu.url = url;
  return searchMenu as any as MenuSearchIndex;
};

/**
 * 处理菜单数据
 * @param menus 原始菜单数据
 * @param returnMenu 上级菜单
 * @param menuMap 菜单映射
 * @param menuFolder 目录映射
 * @param topLevelMenu 顶级菜单或目录的映射
 * @returns
 */
const processMenuData = (
  menus: MenuEntity[],
  returnMenu: MenuFiber | null,
  menuMap: Map<MenuURL, MenuFiber>,
  menuFolder: Map<MenuKey, MenuFiber>,
  topLevelMenu: Map<MenuKey, MenuFiber>,
  menuIndex: MenuSearchIndex[]
) => {
  const createMenuFiber = (menu: MenuEntity, returnMenu: MenuFiber) => {
    const { key } = menu;
    const menuFiber: MenuFiber = {
      key,
      raw: menu,
      return: returnMenu,
      sibling: null,
      child: null,
    };
    return menuFiber;
  };
  let resultingFirstChild: MenuFiber = null;
  let previousNewFiber: MenuFiber = null;
  menus.forEach((menu) => {
    const menuFiber = createMenuFiber(menu, returnMenu);
    if (previousNewFiber === null) {
      resultingFirstChild = menuFiber;
    } else {
      previousNewFiber.sibling = menuFiber;
    }
    // 存在 url 就一定是菜单
    if (menu.path) {
      menuMap.set(menu.path, menuFiber);
      const index = generateMenuIndex(menuFiber, menu.path, menuFiber.key);
      if (menuIndex.findIndex((m) => m.key === menuFiber.key) < 0) {
        menuIndex.push(index);
      }
    } else if (!menu.path && menu.children && menu.children.length > 0) {
      // 存在 children 那么一定是目录
      menuFolder.set(menu.key, menuFiber);
      menuFiber.child = processMenuData(
        menu.children,
        menuFiber,
        menuMap,
        menuFolder,
        topLevelMenu,
        menuIndex
      );
    }
    if (menuFiber.return === null) {
      topLevelMenu.set(menuFiber.key, menuFiber);
    }
    previousNewFiber = menuFiber;
  });
  return resultingFirstChild;
};

interface BaseStoreProps {
  menus: MenuEntity[];
  user: UserEntity;
}

const createStore = ({ menus, user }: BaseStoreProps) => {
  /**
   * 菜单的链表关结构
   */
  const menuRoot = useRef<MenuRoot>({
    key: "menuRoot",
    child: null,
  });
  /**
   * 菜单的映射关系 url => MenuFiber
   */
  const menuMap = useRef<Map<MenuURL, MenuFiber>>(new Map());
  /**
   * 菜单目录的映射关系 key => MenuFiber
   */
  const menuFolder = useRef<Map<MenuKey, MenuFiber>>(new Map());
  /**
   * 顶层菜单，为了方便图标的注册跟查找 key => MenuFiber
   */
  const topLevelMenu = useRef<Map<MenuKey, MenuFiber>>(new Map());

  const menuIndex = useRef<MenuSearchIndex[]>([]);

  menuRoot.current.child = useMemo(() => {
    if (!menus || menus.length === 0) {
      return null;
    }
    return processMenuData(
      menus,
      null,
      menuMap.current,
      menuFolder.current,
      topLevelMenu.current,
      menuIndex.current
    );
  }, [menus]);

  const segment = useSelectedLayoutSegment();
  const segments = useSelectedLayoutSegments();
  const getOpenedKeys = useCallback((segment: string) => {
    const menuPath = `/${segment}`;
    const openedKeys: string[] = [];
    if (menuMap.current.has(menuPath)) {
      const menuFiber = menuMap.current.get(menuPath);
      let current = menuFiber.return;
      while (current) {
        openedKeys.push(current.key);
        current = current.return;
      }
      return openedKeys;
    }
  }, []);

  const [openedKeys, setOpenedKeys] = useState<string[]>(() =>
    getOpenedKeys(segment)
  );

  const updateOpenedKeys = useCallback(
    (key: string, open: boolean) => {
      if (open && !openedKeys.includes(key)) {
        setOpenedKeys((prev) => {
          if (prev.includes(key)) {
            return prev;
          }
          return [...prev, key];
        });
      } else {
        setOpenedKeys((prev) => {
          if (!prev.includes(key)) {
            return prev;
          }
          return prev.filter((k) => k !== key);
        });
      }
    },
    [openedKeys]
  );

  const breadcrumbs = useMemo(() => {
    const breadcrumbItems = [];
    segments.reduce((prev, current) => {
      const matchUrl = `${prev}/${current}`;
      let menuFiber = menuMap.current.get(matchUrl);
      if (!menuFiber) {
        menuFiber = menuMap.current.get(`${prev}`);
        // TODO 待功能完全后完善
      } else {
        while (menuFiber) {
          breadcrumbItems.push({
            key: menuFiber.key,
            name: menuFiber.raw.name,
            path: menuFiber.raw.path,
          });
          menuFiber = menuFiber.return;
        }
      }

      return matchUrl;
    }, "");
    return breadcrumbItems.reverse();
  }, [segments]);

  const activeMenu = useMemo(() => {
    const menuPath = `/${segment}`;
    if (menuMap.current.has(`/${segment}`)) {
      const menuFiber = menuMap.current.get(menuPath);

      return menuFiber.key;
    }
  }, [segment]);

  const store = useMemo(() => {
    return {
      menus,
      user,
      openedKeys,
      updateOpenedKeys,
      activeMenu,
      breadcrumbs,
    };
  }, [menus, user, openedKeys, updateOpenedKeys, activeMenu, breadcrumbs]);

  return store;
};

export default createStore;
