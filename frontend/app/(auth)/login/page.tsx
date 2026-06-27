import React from "react";
import { LoginForm } from "./components/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập | Affiliate Aggregator Hub",
  description: "Đăng nhập vào hệ thống quản lý Affiliate Aggregator Hub",
};

export default function LoginPage() {
  return <LoginForm />;
}
