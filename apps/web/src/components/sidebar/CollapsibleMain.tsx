"use client";

import { ChevronRight, Settings2, UserRoundSearch } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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

export function CollapsibleMain({
  items,
  openedKeys,
}: {
  items: MenuEntity[];
  openedKeys: string[];
}) {
  const { updateOpenedKeys, activeMenu } = useBaseStore();
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const MenuIcon = getIcon(item.key);
          return (
            <Collapsible
              onOpenChange={(open) => {
                updateOpenedKeys(item.key, open);
              }}
              key={item.key}
              open={openedKeys.includes(item.key)}
              asChild
              className="group/collapsible"
            >
              <SidebarMenuItem key={item.key}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.name}>
                    {MenuIcon && <MenuIcon />}
                    <span>{item.name}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="CollapsibleContent">
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
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
