import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { FieldSpec } from '../useForm';
import { generateFieldClasses } from '../styles/utils';
import { StyleOverrides } from '../styles/types';

interface CheckboxFieldProps {
  spec: FieldSpec;
  path: string;
  value: boolean;
  onChange: (value: boolean) => void;
  error?: string[];
  registerRef?: (path: string, ref: any) => void;
  styleOverrides?: StyleOverrides;
}

export interface FieldRef {
  setValue: (value: any) => void;
  getValue: () => any;
  focus?: () => void;
}

const CheckboxField = forwardRef<FieldRef, CheckboxFieldProps>(
  ({ spec, path, value, onChange, error, registerRef, styleOverrides }, ref) => {
    const checkboxRef = useRef<HTMLInputElement>(null);
    const fieldClasses = generateFieldClasses(path, 'checkbox', styleOverrides);
  
    useImperativeHandle(ref, () => ({
      setValue: (newValue: boolean) => {
        onChange(newValue);
      },
      getValue: () => value,
      focus: () => checkboxRef.current?.focus()
    }));

    useEffect(() => {
      if (registerRef && ref) {
        registerRef(path, ref);
      }
    }, [path, registerRef, ref]);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.checked);
    };
  
    return (
      <div className={`${fieldClasses} checkbox-wrapper`}>
        <div className="checkbox-container">
          <input
            ref={checkboxRef}
            type="checkbox"
            id={path}
            checked={value || false}
            onChange={handleChange}
            aria-invalid={!!error && error.length > 0}
          />
          <label htmlFor={path}>{spec.label}</label>
        </div>
        {error && error.map((err, i) => (
          <span key={i} className="validation-message validation-error">
            {err}
          </span>
        ))}
      </div>
    );
  }
);

CheckboxField.displayName = 'CheckboxField';

export default CheckboxField;