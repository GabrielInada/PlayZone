import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, type, ...props }, ref) => {
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (type === 'number') {
        // 1. Permitir teclas de controle
        const isControlKey = [
          'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 
          'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
        ].includes(e.key);

        // 2. Permitir atalhos de teclado (Ctrl/Cmd + A, C, V, X)
        const isShortcut = (e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase());

        // 3. Verificar se a tecla é um número
        const isNumber = /^[0-9]$/.test(e.key);

        // Se não for nada disso, bloqueia a entrada
        if (!isControlKey && !isShortcut && !isNumber) {
          e.preventDefault();
        }
      }
    }; 

    return (
      <div className="flex flex-col gap-1 w-full font-roboto">
        <label className="text-sm font-bold text-black-700">{label}</label>
        <input
          {...props}
          type={type}
          ref={ref}
          onKeyDown={handleKeyDown}
          className={`
            p-2 border border-[#004a1b] rounded-md text-black 
            placeholder:text-gray-400 focus:outline-none focus:ring-2 
            focus:ring-green-600 transition-all text-sm
            ${className || 'bg-[#E8E8E8]'} 
          `}
        />
      </div>
    );
  }
);

Input.displayName = "Input";