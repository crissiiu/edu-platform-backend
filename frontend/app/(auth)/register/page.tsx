import React from "react";
import { RegisterForm } from "./components/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản | Affiliate Aggregator Hub",
  description: "Đăng ký tài khoản mới tại hệ thống Affiliate Aggregator Hub",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
