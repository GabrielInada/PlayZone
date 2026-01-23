import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm font-bold text-gray-700">{label}</label>
        <input
          {...props}
          ref={ref} // Passa a referência para a validação funcionar
          className="p-2 border border-[#004a1b] rounded-md bg-[#E8E8E8] text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600 transition-all"
        />
      </div>
    );
  }
);

Input.displayName = "Input";