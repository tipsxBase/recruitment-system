"use client";

import { Settings2, UserRoundSearch } from "lucide-react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { MenuEntity } from "@recruitment/schema/interface";
import { useBaseStore } from "../base-layout/BaseProvider";

const iconMapper = {
  Recruitment: UserRoundSearch,
  SystemSetting: Settings2,
};

const getIcon = (key) => {
  return iconMapper[key];
};

export function NavMain({ items }: { items: MenuEntity[] }) {
  const { activeMenu } = useBaseStore();
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const MenuIcon = getIcon(item.key);
          return (
            <SidebarMenuItem key={item.key}>
              <SidebarMenuButton tooltip={item.name}>
                {MenuIcon && <MenuIcon />}
                <span>{item.name}</span>
              </SidebarMenuButton>

              <SidebarMenuSub>
                {item.children?.map((subItem) => {
                  return (
                    <SidebarMenuSubItem key={subItem.key}>
                      <SidebarMenuSubButton
                        isActive={activeMenu === subItem.key}
                        asChild
                      >
                        <a href={subItem.path}>
                          <span>{subItem.name}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
