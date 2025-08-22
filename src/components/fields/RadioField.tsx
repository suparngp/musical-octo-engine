import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { FieldSpec } from '../useForm';
import { generateFieldClasses } from '../styles/utils';
import { StyleOverrides } from '../styles/types';

interface RadioFieldProps {
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
}

const RadioField = forwardRef<FieldRef, RadioFieldProps>(
  ({ spec, path, value, onChange, error, registerRef, styleOverrides }, ref) => {
    const fieldName = path;
    const fieldClasses = generateFieldClasses(path, 'radio', styleOverrides);
  
    useImperativeHandle(ref, () => ({
      setValue: (newValue: string) => {
        onChange(newValue);
      },
      getValue: () => value
    }));

    useEffect(() => {
      if (registerRef && ref) {
        registerRef(path, ref);
      }
    }, [path, registerRef, ref]);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    };
  
    const renderOptions = () => {
      if (!spec.options) return null;
      
      return spec.options.map(option => {
        const optionValue = typeof option === 'string' ? option : option.value;
        const optionLabel = typeof option === 'string' ? option : option.label;
        
        return (
          <div key={optionValue} className="radio-option">
            <input
              type="radio"
              id={`${fieldName}-${optionValue}`}
              name={fieldName}
              value={optionValue}
              checked={value === optionValue}
              onChange={handleChange}
            />
            <label htmlFor={`${fieldName}-${optionValue}`}>{optionLabel}</label>
          </div>
        );
      });
    };

    return (
      <div className={fieldClasses}>
        <fieldset aria-invalid={!!error && error.length > 0}>
          <legend>{spec.label}</legend>
          {renderOptions()}
        </fieldset>
        {error && error.map((err, i) => (
          <span key={i} className="validation-message validation-error">
            {err}
          </span>
        ))}
      </div>
    );
  }
);

RadioField.displayName = 'RadioField';

export default RadioField;