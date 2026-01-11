import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = ({ label, ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-bold text-gray-700">{label}</label>
      <input
        {...props}
        className="p-2 border border-gray-300 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600 transition-all"
      />
    </div>
  );
};