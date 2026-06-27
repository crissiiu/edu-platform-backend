"use client";

import React from "react";
import { Input as AntdInput, InputProps as AntdInputProps } from "antd";

export interface InputProps extends AntdInputProps {
  className?: string;
}

export const Input: React.FC<InputProps> = ({ className = "", ...props }) => {
  return (
    <AntdInput
      className={`rounded-lg border-gray-300 hover:border-indigo-400 focus:border-indigo-500 focus:shadow-[0_0_0_2px_rgba(99,102,241,0.15)] h-10 transition-all duration-150 ${className}`}
      {...props}
    />
  );
};

export default Input;
