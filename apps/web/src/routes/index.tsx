import { createFileRoute } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Briefcase,
  Calendar,
  FileText,
  BarChart3,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  UserCheck,
  MessageSquare,
  Bell,
} from "lucide-react";
import Header from "@/components/Header";
import logo from "../logo.svg";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return (
      <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col ">
        <Header />
        <ScrollArea className="flex-1 overflow-auto">
          <div className="flex flex-col items-center justify-center px-6 min-h-[calc(100vh-70px)]">
            <div className="w-full max-w-4xl mx-auto">
              {/* Hero Section */}
              <div className="text-center mb-12">
                <div className="mb-8">
                  <img
                    src={logo}
                    className="h-16 mx-auto mb-6 drop-shadow-sm"
                    alt="招聘系统"
                  />
                  <h1 className="text-3xl font-light text-slate-800 mb-3 tracking-tight">
                    企业招聘管理系统
                  </h1>
                  <p className="text-lg text-slate-600 font-light">
                    Talent Management Platform
                  </p>
                </div>

                <div className="w-20 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto mb-6"></div>

                <p className="text-slate-500 font-light">
                  简化招聘流程，提升人才获取效率
                </p>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:bg-white/90 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Briefcase className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-base font-medium text-slate-800 mb-2">
                      职位管理
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      创建发布职位，跟踪招聘进度
                    </p>
                  </div>
                </div>

                <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:bg-white/90 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-base font-medium text-slate-800 mb-2">
                      候选人管理
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      管理简历信息，构建人才库
                    </p>
                  </div>
                </div>

                <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:bg-white/90 hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-base font-medium text-slate-800 mb-2">
                      面试安排
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      智能排程，协调面试流程
                    </p>
                  </div>
                </div>

                <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:bg-white/90 hover:shadow-xl hover:shadow-amber-100/50 transition-all duration-300">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-base font-medium text-slate-800 mb-2">
                      数据洞察
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      招聘数据分析与报告
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* 欢迎区域 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                欢迎回来，{user.username}！
              </h1>
              <p className="text-gray-600 mt-1">
                今天是{" "}
                {new Date().toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "long",
                })}
              </p>
            </div>
            <div className="flex gap-3">
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                新建职位
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Bell className="h-4 w-4" />
                通知中心
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">活跃职位</p>
                  <p className="text-3xl font-bold text-gray-900">24</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% 本月
                  </p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    待处理简历
                  </p>
                  <p className="text-3xl font-bold text-gray-900">156</p>
                  <p className="text-xs text-orange-600 flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    需要审核
                  </p>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">今日面试</p>
                  <p className="text-3xl font-bold text-gray-900">8</p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <Calendar className="h-3 w-3 mr-1" />2 个即将开始
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">本月入职</p>
                  <p className="text-3xl font-bold text-gray-900">12</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +25% 较上月
                  </p>
                </div>
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 主要功能区域 */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              核心功能
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                    <CardTitle className="text-lg">职位管理</CardTitle>
                  </div>
                  <CardDescription>
                    创建、编辑和管理招聘职位信息
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">24 个活跃职位</span>
                    <Button size="sm" variant="ghost">
                      查看详情 <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-green-600" />
                    <CardTitle className="text-lg">候选人管理</CardTitle>
                  </div>
                  <CardDescription>管理求职者信息和简历状态</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">156 个候选人</span>
                    <Button size="sm" variant="ghost">
                      查看详情 <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-6 w-6 text-purple-600" />
                    <CardTitle className="text-lg">面试安排</CardTitle>
                  </div>
                  <CardDescription>安排和跟踪面试流程</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">8 个今日面试</span>
                    <Button size="sm" variant="ghost">
                      查看详情 <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-6 w-6 text-indigo-600" />
                    <CardTitle className="text-lg">数据分析</CardTitle>
                  </div>
                  <CardDescription>查看招聘数据和统计报表</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">查看报表</span>
                    <Button size="sm" variant="ghost">
                      查看详情 <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 最近活动 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  最近活动
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-gray-900">新增候选人简历</p>
                    <p className="text-xs text-gray-500">
                      张三投递了前端开发工程师职位
                    </p>
                    <p className="text-xs text-gray-400">2 分钟前</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-gray-900">面试安排</p>
                    <p className="text-xs text-gray-500">
                      李四的产品经理面试已安排
                    </p>
                    <p className="text-xs text-gray-400">1 小时前</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-gray-900">职位发布</p>
                    <p className="text-xs text-gray-500">UI设计师职位已发布</p>
                    <p className="text-xs text-gray-400">3 小时前</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 用户信息卡片 */}
            <Card>
              <CardHeader>
                <CardTitle>个人信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">用户名</span>
                  <span className="text-sm font-medium">{user.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">邮箱</span>
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">部门</span>
                  <span className="text-sm font-medium">
                    {user.department?.name || "未分配"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">角色</span>
                  <span className="text-sm font-medium">
                    {user.roles.map((r) => r.name).join(", ") || "无"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">状态</span>
                  <span
                    className={`text-sm font-medium ${
                      user.emailVerified ? "text-green-600" : "text-orange-600"
                    }`}
                  >
                    {user.emailVerified ? "已验证" : "未验证"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* 快速操作 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  快速操作
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  发布新职位
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  安排面试
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  发送消息
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  生成报表
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
