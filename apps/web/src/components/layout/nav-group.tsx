import { type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  type NavCollapsible,
  type NavItem,
  type NavLink,
  type NavGroup,
} from "./types";
import type { MenuResponse } from "@recruitment/schema";
import { getMenuData } from "./data/sidebar-data";

export function NavGroup({ menus }: NavGroup) {
  const { state, isMobile } = useSidebar();
  const href = useLocation({ select: (location) => location.href });
  return (
    <SidebarGroup>
      <SidebarMenu>
        {menus.map((item) => {
          const key = `${item.id}`;

          if (!item.children || item.children.length === 0)
            return <SidebarMenuLink key={key} item={item} href={href} />;

          if (state === "collapsed" && !isMobile)
            return (
              <SidebarMenuCollapsedDropdown key={key} item={item} href={href} />
            );

          return <SidebarMenuCollapsible key={key} item={item} href={href} />;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

const NavBadge = ({ children }: { children: ReactNode }) => (
  <Badge className="rounded-full px-1 py-0 text-xs">{children}</Badge>
);

const SidebarMenuLink = ({
  item,
  href,
}: {
  item: MenuResponse;
  href: string;
}) => {
  const { setOpenMobile } = useSidebar();
  const meta = getMenuData(item.id);
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={checkIsActive(href, item)}
        tooltip={item.name}
      >
        <Link to={meta?.path} onClick={() => setOpenMobile(false)}>
          {meta?.icon && <meta.icon />}
          <span>{item.name}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const SidebarMenuCollapsible = ({
  item,
  href,
}: {
  item: MenuResponse;
  href: string;
}) => {
  const { setOpenMobile } = useSidebar();
  const menuMeta = getMenuData(item.id);
  return (
    <Collapsible
      asChild
      defaultOpen={checkIsActive(href, item, true)}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.name}>
            {menuMeta?.icon && <menuMeta.icon />}
            <span>{item.name}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="CollapsibleContent">
          <SidebarMenuSub>
            {item.children?.map((subItem) => {
              const subItemMeta = getMenuData(subItem.id);
              return (
                <SidebarMenuSubItem key={subItem.id}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={checkIsActive(href, subItem)}
                  >
                    <Link
                      to={subItemMeta?.path}
                      onClick={() => setOpenMobile(false)}
                    >
                      {subItemMeta?.icon && <subItemMeta.icon />}
                      <span>{subItem.name}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

const SidebarMenuCollapsedDropdown = ({
  item,
  href,
}: {
  item: MenuResponse;
  href: string;
}) => {
  const menuMeta = getMenuData(item.id);

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={item.name}
            isActive={checkIsActive(href, item)}
          >
            {menuMeta?.icon && <menuMeta.icon />}
            <span>{item.name}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" sideOffset={4}>
          <DropdownMenuLabel>{item.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item?.children?.map((sub) => {
            const menuMeta = getMenuData(sub.id);
            return (
              <DropdownMenuItem key={sub.id} asChild>
                <Link
                  to={menuMeta?.path}
                  className={`${checkIsActive(href, sub) ? "bg-secondary" : ""}`}
                >
                  {menuMeta?.icon && <menuMeta.icon />}
                  <span className="max-w-52 text-wrap">{sub.name}</span>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

function checkIsActive(href: string, item: MenuResponse, mainNav = false) {
  const meta = getMenuData(item.id);
  return (
    href === meta?.path || // /endpint?search=param
    href.split("?")[0] === meta?.path || // endpoint
    !!item?.children?.filter((i) => meta?.path === href).length || // if child nav is active
    (mainNav &&
      href.split("/")[1] !== "" &&
      href.split("/")[1] === meta?.path?.split("/")[1])
  );
}
