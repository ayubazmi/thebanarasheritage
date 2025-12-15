import React from 'react';
import { LucideIcon } from 'lucide-react';

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', size = 'md', isLoading, className = '', ...props 
}) => {
  const base = "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand-900 text-white hover:bg-black",
    secondary: "bg-brand-200 text-brand-900 hover:bg-brand-300",
    outline: "border border-brand-800 text-brand-900 hover:bg-brand-50",
    danger: "bg-rose-500 text-white hover:bg-rose-600"
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-5 py-2.5",
    lg: "text-base px-8 py-3"
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {isLoading ? <span className="animate-pulse">Loading...</span> : children}
    </button>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
}

export const Input: React.FC<InputProps> = ({ label, error, icon: Icon, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-brand-900 mb-1">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
        <input 
          className={`w-full border ${error ? 'border-rose-500' : 'border-gray-200'} bg-white px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-800 transition-colors ${Icon ? 'pl-10' : ''} ${className}`}
          {...props} 
        />
      </div>
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
};

// --- Badge ---
export const Badge: React.FC<{ children: React.ReactNode, color?: string }> = ({ children, color = 'bg-brand-200 text-brand-900' }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color}`}>
    {children}
  </span>
);

// --- Section Header ---
export const SectionHeader: React.FC<{ title: string, subtitle?: string, center?: boolean }> = ({ title, subtitle, center }) => (
  <div className={`mb-10 ${center ? 'text-center' : ''}`}>
    <h2 className="text-3xl font-serif text-brand-900 mb-2">{title}</h2>
    {subtitle && <p className="text-brand-800/70 font-light max-w-2xl mx-auto">{subtitle}</p>}
    <div className={`h-0.5 w-16 bg-brand-800/20 mt-4 ${center ? 'mx-auto' : ''}`} />
  </div>
);