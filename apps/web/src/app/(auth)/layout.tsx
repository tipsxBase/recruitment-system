import { getMenus } from "../actions/menu";
import BaseLayout from "@/components/base-layout";
import { getSession } from "../actions/session";
import { getRoutes } from "../actions/getRoutes";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const res = await getMenus();
  const session = await getSession();
  const { data } = res;
  await getRoutes();
  return (
    <BaseLayout user={session} menus={data}>
      {children}
    </BaseLayout>
  );
}
