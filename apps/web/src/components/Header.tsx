import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";
import { User, LogOut } from "lucide-react";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="p-4 flex gap-4 bg-white text-black justify-between border-b">
      <nav className="flex flex-row items-center">
        <div className="px-2 font-bold text-xl">
          <Link to="/" className="text-blue-600 hover:text-blue-500">
            招聘系统
          </Link>
        </div>
      </nav>

      <div className="flex items-center gap-4">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span>欢迎，{user.username}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              退出
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="outline" size="sm">
                登录
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">注册</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
