"use client";

import { ReactNode } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "danger";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  variant: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-200 text-black hover:bg-gray-300",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(
        "px-8 py-2 rounded font-medium transition-colors duration-200",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
