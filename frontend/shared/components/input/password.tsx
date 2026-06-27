"use client";

import React from "react";
import { Input as AntdInput } from "antd";

export const InputPassword: React.FC<React.ComponentProps<typeof AntdInput.Password>> = ({ className = "", ...props }) => {
  return (
    <AntdInput.Password
      className={`rounded-lg border-gray-300 hover:border-indigo-400 focus:border-indigo-500 focus:shadow-[0_0_0_2px_rgba(99,102,241,0.15)] h-10 transition-all duration-150 ${className}`}
      {...props}
    />
  );
};

export default InputPassword;
