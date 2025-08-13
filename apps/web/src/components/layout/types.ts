import type { MenuResponse } from "@recruitment/schema";
import { type LinkProps } from "@tanstack/react-router";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface Team {
  name: string;
  logo: React.ElementType;
  plan: string;
}

interface BaseNavItem {
  title: string;
  badge?: string;
  icon?: React.ElementType;
}

type NavLink = BaseNavItem & {
  url: LinkProps["to"];
  items?: never;
};

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: LinkProps["to"] })[];
  url?: never;
};

type NavItem = NavCollapsible | NavLink;

interface NavGroup {
  menus: MenuResponse[];
}

interface SidebarData {
  user: User;
  teams: Team[];
}

export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink };
