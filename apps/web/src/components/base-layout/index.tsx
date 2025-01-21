"use client";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/sidebar";
import { MenuEntity, UserEntity } from "@recruitment/schema/interface";
import { BaseProvider } from "./BaseProvider";
import createStore from "./createStore";
import ClientBreadcrumb from "../client-breadcrumb";
export default function BaseLayout({
  children,
  menus,
  user,
}: Readonly<{
  children: React.ReactNode;
  menus: MenuEntity[];
  user: UserEntity;
}>) {
  const store = createStore({ menus, user });

  return (
    <BaseProvider store={store}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <ClientBreadcrumb />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </BaseProvider>
  );
}
