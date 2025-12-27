
// src/components/ui/FormErrors.tsx
import React from 'react';
import { AlertCircle, XCircle } from 'lucide-react';

interface FormErrorsProps {
  errors?: Record<string, string[]>;
  message?: string;
  className?: string;
}

export function FormErrors({ errors, message, className = '' }: FormErrorsProps) {
  if (!errors && !message) return null;
  
  return (
    <div className={`rounded-lg border border-red-200 bg-red-50 p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
        <div className="flex-1">
          {message && (
            <p className="text-sm font-medium text-red-800 mb-2">
              {message}
            </p>
          )}
          
          {errors && Object.keys(errors).length > 0 && (
            <ul className="space-y-1">
              {Object.entries(errors).map(([field, fieldErrors]) => (
                <li key={field} className="text-sm text-red-700">
                  <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>
                      <span className="font-medium capitalize">
                        {field.replace(/_/g, ' ')}:
                      </span>{' '}
                      {fieldErrors.join(', ')}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}