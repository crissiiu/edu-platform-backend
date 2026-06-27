"use client";

import React, { useState } from "react";
import { Layout, Menu, Button, Avatar, Dropdown, Space, theme } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppStoreHydrated } from "@/shared/stores/app-store";

const { Header, Sider, Content } = Layout;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  const userInfo = useAppStoreHydrated((state) => state.userInfo);
  const clearAuth = useAppStoreHydrated((state) => state.clearAuth);
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    if (clearAuth) clearAuth();
    router.push("/login");
  };

  const userMenuItems = [
    {
      key: "profile",
      label: "Hồ sơ của tôi",
      icon: <UserOutlined />,
    },
    {
      key: "settings",
      label: "Cài đặt",
      icon: <SettingOutlined />,
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  const menuItems = [
    {
      key: "/admin/dashboard",
      icon: <DashboardOutlined />,
      label: <Link href="/admin/dashboard">Dashboard</Link>,
    },
    {
      key: "/admin/products",
      icon: <ShoppingOutlined />,
      label: <Link href="/admin/products">Quản lý sản phẩm</Link>,
    },
    {
      key: "/admin/users",
      icon: <UserOutlined />,
      label: <Link href="/admin/users">Quản lý thành viên</Link>,
    },
    {
      key: "/admin/settings",
      icon: <SettingOutlined />,
      label: <Link href="/admin/settings">Cài đặt hệ thống</Link>,
    },
  ];

  return (
    <Layout className="min-h-screen">
      {/* Sidebar */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="light"
        className="border-r border-gray-200/50 shadow-sm"
        width={256}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-100 px-6 overflow-hidden">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-lg text-indigo-600 truncate">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black shrink-0">
              A
            </span>
            {!collapsed && <span className="transition-all duration-300">Affiliate Hub</span>}
          </Link>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          className="border-none mt-4 px-2"
        />
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header 
          style={{ background: colorBgContainer }} 
          className="h-16 px-6 flex items-center justify-between border-b border-gray-100 shadow-sm sticky top-0 z-10"
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-600"
          />
          
          <div className="flex items-center gap-6">
            <Button
              type="text"
              icon={<BellOutlined className="text-lg" />}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-500 rounded-full"
            />
            
            <Dropdown menu={{ items: userMenuItems }} trigger={["click"]} placement="bottomRight">
              <Space className="cursor-pointer hover:opacity-85 transition-opacity py-1 px-2 rounded-lg hover:bg-gray-50">
                <Avatar 
                  src={userInfo?.avatar} 
                  icon={!userInfo?.avatar && <UserOutlined />}
                  className="bg-indigo-100 text-indigo-600"
                />
                <div className="hidden md:flex flex-col text-left shrink-0">
                  <span className="text-sm font-medium text-gray-800 leading-tight">
                    {userInfo?.name || "Admin User"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {userInfo?.role || "Administrator"}
                  </span>
                </div>
              </Space>
            </Dropdown>
          </div>
        </Header>

        {/* Content */}
        <Content
          className="m-6 p-6 min-h-[280px]"
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
