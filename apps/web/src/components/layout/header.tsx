import { Search } from "../search";
import { ThemeSwitch } from "../theme-switcher";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";

export const Header = () => {
  return (
    <header className="flex items-center justify-between h-16 p-4 gap-3 shadow-none w-full">
      <SidebarTrigger variant="outline" className="scale-125 sm:scale-100" />
      <Separator orientation="vertical" />
      <div className="flex-1 items-center justify-between flex gap-3">
        <Search />
        <div className="flex-1 flex items-center"></div>
        <ThemeSwitch />
      </div>
    </header>
  );
};

export default Header;
