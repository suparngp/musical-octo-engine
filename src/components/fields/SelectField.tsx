import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { FieldSpec } from '../useForm';
import { generateFieldClasses } from '../styles/utils';
import { StyleOverrides } from '../styles/types';

interface SelectFieldProps {
  spec: FieldSpec;
  path: string;
  value: string;
  onChange: (value: string) => void;
  error?: string[];
  registerRef?: (path: string, ref: any) => void;
  styleOverrides?: StyleOverrides;
}

export interface FieldRef {
  setValue: (value: any) => void;
  getValue: () => any;
  focus?: () => void;
}

const SelectField = forwardRef<FieldRef, SelectFieldProps>(
  ({ spec, path, value, onChange, error, registerRef, styleOverrides }, ref) => {
    const selectRef = useRef<HTMLSelectElement>(null);
    const fieldClasses = generateFieldClasses(path, 'select', styleOverrides);
  
    useImperativeHandle(ref, () => ({
      setValue: (newValue: string) => {
        onChange(newValue);
      },
      getValue: () => value,
      focus: () => selectRef.current?.focus()
    }));

    useEffect(() => {
      if (registerRef && ref) {
        registerRef(path, ref);
      }
    }, [path, registerRef, ref]);
  
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(e.target.value);
    };
  
    const renderOptions = () => {
      if (!spec.options) return null;
      
      return spec.options.map(option => {
        if (typeof option === 'string') {
          return <option key={option} value={option}>{option}</option>;
        } else {
          return <option key={option.value} value={option.value}>{option.label}</option>;
        }
      });
    };

    return (
      <div className={fieldClasses}>
        <label htmlFor={path}>{spec.label}</label>
        <select
          ref={selectRef}
          id={path}
          value={value || ''}
          onChange={handleChange}
          aria-invalid={!!error && error.length > 0}
        >
          {renderOptions()}
        </select>
        {error && error.map((err, i) => (
          <span key={i} className="validation-message validation-error">
            {err}
          </span>
        ))}
      </div>
    );
  }
);

SelectField.displayName = 'SelectField';

export default SelectField;