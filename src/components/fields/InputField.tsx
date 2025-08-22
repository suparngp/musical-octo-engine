import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { FieldSpec } from '../useForm';
import { StyleOverrides } from '../styles/types';
import { generateFieldClasses } from '../styles/utils';

interface InputFieldProps {
  spec: FieldSpec;
  path: string;
  value: string;
  onChange?: (value: string) => void;
  error?: string[];
  registerRef?: (path: string, ref: any) => void;
  styleOverrides?: StyleOverrides;
}

export interface FieldRef {
  setValue: (value: any) => void;
  getValue: () => any;
  focus?: () => void;
}

const InputField = forwardRef<FieldRef, InputFieldProps>(
  ({ spec, path, value, onChange, error, registerRef, styleOverrides }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const fieldClasses = generateFieldClasses(path, 'input', styleOverrides);

    const [setState] = useState<unknown>()
  
    useImperativeHandle(ref, () => ({
      setValue: (newValue: string) => {
        onChange?.(newValue);
      },
      getValue: () => value,
      focus: () => inputRef.current?.focus()
    }));

    useEffect(() => {
      if (registerRef && ref) {
        registerRef(path, ref);
      }
    }, [path, registerRef, ref]);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
      setState(e.target.value as unknown)
    };
  
    return (
      <div className={fieldClasses}>
        <label htmlFor={path}>{spec.label}</label>
        <input
          ref={inputRef}
          id={path}
          type="text"
          value={value || ''}
          onChange={handleChange}
          placeholder={spec.placeholder}
          aria-invalid={!!error && error.length > 0}
        />
        {error && error.map((err, i) => (
          <span key={i} className="validation-message validation-error">
            {err}
          </span>
        ))}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;