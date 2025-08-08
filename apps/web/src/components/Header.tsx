import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useAuthStore } from "@/stores/auth";
import {
  User,
  LogOut,
  Settings,
  Bell,
  Search,
  Menu,
  Users,
  Briefcase,
  Calendar,
  BarChart3,
  Shield,
  HelpCircle,
} from "lucide-react";
import logo from "../logo.svg";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo and Brand */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img src={logo} alt="Logo" className="h-8 w-8" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">招聘管理系统</h1>
              <p className="text-xs text-gray-500">Recruitment System</p>
            </div>
          </Link>

          {/* Navigation Menu - Only show when authenticated */}
          {isAuthenticated && (
            <nav className="hidden lg:flex items-center gap-6">
              <Link
                to="/"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                工作台
              </Link>
              <div className="text-sm font-medium text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1 cursor-not-allowed">
                <Briefcase className="h-4 w-4" />
                职位管理
              </div>
              <div className="text-sm font-medium text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1 cursor-not-allowed">
                <Users className="h-4 w-4" />
                候选人
              </div>
              <div className="text-sm font-medium text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1 cursor-not-allowed">
                <Calendar className="h-4 w-4" />
                面试安排
              </div>
              <div className="text-sm font-medium text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1 cursor-not-allowed">
                <BarChart3 className="h-4 w-4" />
                数据分析
              </div>
            </nav>
          )}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              {/* Search - Hidden on small screens */}
              <div className="hidden md:flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Bell className="h-4 w-4" />
                </Button>
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
                >
                  3
                </Badge>
              </div>

              {/* Mobile menu button */}
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="h-4 w-4" />
              </Button>

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">
                        {getInitials(user.username)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-500 text-white text-xs">
                            {getInitials(user.username)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="text-sm font-medium leading-none">
                            {user.username}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground mt-1">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {user.department?.name || "未分配部门"}
                        </Badge>
                        {user.roles.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {user.roles[0].name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>个人资料</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>账户设置</span>
                  </DropdownMenuItem>
                  {user.roles.some((role) => role.name.includes("管理员")) && (
                    <DropdownMenuItem className="cursor-pointer">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>系统管理</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="cursor-pointer">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>帮助文档</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>退出登录</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900"
                >
                  登录
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  注册账户
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
