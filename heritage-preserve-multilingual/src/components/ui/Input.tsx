import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-silver mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2.5 bg-indigo-950/50 border border-silver/20 rounded-lg text-white placeholder-silver/50 focus:outline-none focus:ring-2 focus:ring-cerulean focus:border-transparent transition-all ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};
