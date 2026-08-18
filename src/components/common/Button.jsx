import React from 'react';
import { Loader2 } from 'lucide-react';

const variantStyles = {
  primary: 'bg-[#1E3A8A] text-white hover:bg-blue-900 focus:ring-blue-500 shadow-xs border border-transparent',
  secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-400 shadow-2xs',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-xs border border-transparent',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent',
  accent: 'bg-[#0EA5E9] text-white hover:bg-sky-600 focus:ring-sky-400 shadow-xs border border-transparent',
};

const sizeStyles = {
  xs: 'px-2.5 py-1 text-xs gap-1.5 font-medium rounded',
  sm: 'px-3 py-1.5 text-xs gap-2 font-medium rounded-md',
  md: 'px-4 py-2 text-sm gap-2 font-medium rounded-md',
  lg: 'px-5 py-2.5 text-base gap-2.5 font-semibold rounded-lg',
};

export const Button = ({
  variant = 'primary',
  size = 'sm',
  isLoading = false,
  disabled,
  leftIcon,
  rightIcon,
  children,
  className = '',
  type = 'button',
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center transition-colors select-none focus:outline-hidden focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${base} ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
