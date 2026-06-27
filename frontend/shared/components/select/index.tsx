"use client";

import React from "react";
import { Select as AntdSelect, SelectProps as AntdSelectProps } from "antd";

export interface SelectProps extends AntdSelectProps {
  className?: string;
}

type CompoundedSelect = React.FC<SelectProps> & {
  Option: typeof AntdSelect.Option;
};

export const Select: CompoundedSelect = ({ className = "", ...props }) => {
  return (
    <AntdSelect
      className={`rounded-lg hover:border-indigo-400 focus:border-indigo-500 transition-all duration-150 h-10 ${className}`}
      classNames={{ popup: { root: "rounded-xl shadow-lg border border-gray-100" } }}
      {...props}
    />
  ) as any; // Cast as any to satisfy type intersection during definition
};

Select.Option = AntdSelect.Option;

export default Select;
