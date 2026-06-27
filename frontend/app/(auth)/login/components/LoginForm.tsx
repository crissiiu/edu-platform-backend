"use client";

import React, { useState } from "react";
import { Form, Input, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/shared/components/button";
import { useAppStore } from "@/shared/stores/app-store";

export const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAppStore((state) => state.setAuth);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Simulate API call for login
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Save mock token & userInfo into global store
      setAuth("mock-jwt-token-xyz-123", {
        id: "usr-1",
        name: values.email.split("@")[0].toUpperCase() || "Admin",
        email: values.email,
        role: "Administrator",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
      });

      toast.success("Đăng nhập thành công!", { position: "top-right" });
      router.push("/admin/products");
    } catch (error) {
      toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Mừng quay trở lại!</h2>
        <p className="text-gray-400 text-sm mt-1">Đăng nhập vào bảng quản trị Affiliate Hub</p>
      </div>

      <Form
        name="login_form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập địa chỉ Email!" },
            { type: "email", message: "Email không đúng định dạng!" },
          ]}
        >
          <Input 
            prefix={<UserOutlined className="text-gray-400" />} 
            placeholder="Địa chỉ Email (admin@test.com)" 
            className="rounded-lg h-11"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Mật khẩu (bất kỳ)"
            className="rounded-lg h-11"
          />
        </Form.Item>

        <Form.Item className="mb-4">
          <div className="flex items-center justify-between">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox className="text-gray-500 text-sm">Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>

            <Link href="/forgot" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              Quên mật khẩu?
            </Link>
          </div>
        </Form.Item>

        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-base"
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>

      <div className="text-center mt-6">
        <span className="text-gray-400 text-sm">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
            Đăng ký ngay
          </Link>
        </span>
      </div>
    </div>
  );
};

export default LoginForm;
