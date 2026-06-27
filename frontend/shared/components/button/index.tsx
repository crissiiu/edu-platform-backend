"use client";

import React from "react";
import { Button as AntdButton, ButtonProps as AntdButtonProps } from "antd";

export interface ButtonProps extends AntdButtonProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Custom Button component wrapping Ant Design's Button.
 * Pre-configured with premium micro-interactions and smooth Tailwind transitions.
 */
export const Button: React.FC<ButtonProps> = ({ children, className = "", ...props }) => {
  return (
    <AntdButton
      className={`font-medium hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 ${className}`}
      {...props}
    >
      {children}
    </AntdButton>
  );
};

export default Button;
