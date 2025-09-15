import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const variantClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 cursor-pointer',
  secondary: 'bg-gray-300 text-gray-700 hover:bg-gray-400 focus:ring-gray-500 cursor-pointer',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 cursor-pointer',
  success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 cursor-pointer', 
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        font-medium rounded-lg
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export function SaveCancelButtons({
  onSave,
  onCancel,
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
  saveDisabled = false,
}: {
  onSave: () => void;
  onCancel: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  saveDisabled?: boolean;
}) {
  return (
    <div className="flex space-x-3">
      <Button
        variant="primary"
        onClick={onSave}
        disabled={saveDisabled}
      >
        {saveLabel}
      </Button>
      <Button
        variant="secondary"
        onClick={onCancel}
      >
        {cancelLabel}
      </Button>
    </div>
  );
}
