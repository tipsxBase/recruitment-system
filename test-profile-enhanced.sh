#!/bin/bash

# 测试增强的 profile 接口
# 验证 profile 接口是否包含分离的菜单和按钮权限

API_BASE="http://localhost:8080/api"

echo "🔐 开始测试增强的 profile 接口..."
echo ""

# 1. 登录获取 token
echo "📝 步骤1: 登录超级管理员账号"
LOGIN_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "username": "superadmin",
    "password": "superadmin@system"
  }' \
  -c cookies.txt \
  "$API_BASE/auth/login")

echo "登录响应: $LOGIN_RESPONSE"
echo ""

# 检查登录是否成功
if [[ $LOGIN_RESPONSE == *"success"* ]]; then
  echo "✅ 登录成功"
else
  echo "❌ 登录失败，退出测试"
  exit 1
fi

echo ""
echo "👤 步骤2: 获取用户 Profile（包含分离的权限）"

# 2. 获取用户 Profile
PROFILE_RESPONSE=$(curl -s -X GET \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  "$API_BASE/auth/profile")

echo "Profile 响应:"
echo "$PROFILE_RESPONSE" | jq '.' 2>/dev/null || echo "$PROFILE_RESPONSE"

echo ""
echo "🔍 检查权限字段："
echo "menuPermissions: $(echo "$PROFILE_RESPONSE" | jq -r '.data.menuPermissions // empty' 2>/dev/null)"
echo "buttonPermissions: $(echo "$PROFILE_RESPONSE" | jq -r '.data.buttonPermissions // empty' 2>/dev/null)"
echo "permissions (兼容): $(echo "$PROFILE_RESPONSE" | jq -r '.data.permissions // empty' 2>/dev/null)"

# 清理临时文件
rm -f cookies.txt

echo ""
echo "🎉 测试完成!"
