"use client";

import React from "react";
import { Form as AntdForm, FormItemProps as AntdFormItemProps } from "antd";

export const FormItem: React.FC<AntdFormItemProps> = ({ className = "", children, ...props }) => {
  return (
    <AntdForm.Item
      className={`mb-4 ${className}`}
      {...props}
    >
      {children}
    </AntdForm.Item>
  );
};

export const Form = AntdForm;
export default Form;
