"use client";

import React, { useState } from "react";
import { Form, Input, Checkbox } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/shared/components/button";

export const RegisterForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Simulate API call for register
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Đăng ký tài khoản thành công! Vui lòng đăng nhập.", { position: "top-right" });
      router.push("/login");
    } catch (error) {
      toast.error("Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Tạo tài khoản mới</h2>
        <p className="text-gray-400 text-sm mt-1">Bắt đầu hành trình affiliate của bạn</p>
      </div>

      <Form
        name="register_form"
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input 
            prefix={<UserOutlined className="text-gray-400" />} 
            placeholder="Họ và tên" 
            className="rounded-lg h-11"
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập địa chỉ Email!" },
            { type: "email", message: "Email không đúng định dạng!" },
          ]}
        >
          <Input 
            prefix={<MailOutlined className="text-gray-400" />} 
            placeholder="Địa chỉ Email" 
            className="rounded-lg h-11"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Mật khẩu"
            className="rounded-lg h-11"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Xác nhận mật khẩu"
            className="rounded-lg h-11"
          />
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error("Bạn phải đồng ý với điều khoản sử dụng!")),
            },
          ]}
        >
          <Checkbox className="text-gray-500 text-sm">
            Tôi đồng ý với{" "}
            <Link href="/terms" className="text-indigo-600 hover:text-indigo-500 font-medium">
              Điều khoản dịch vụ
            </Link>
          </Checkbox>
        </Form.Item>

        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-base"
          >
            Đăng ký
          </Button>
        </Form.Item>
      </Form>

      <div className="text-center mt-6">
        <span className="text-gray-400 text-sm">
          Đã có tài khoản?{" "}
          <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
            Đăng nhập ngay
          </Link>
        </span>
      </div>
    </div>
  );
};

export default RegisterForm;
