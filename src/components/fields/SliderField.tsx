import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { FieldSpec } from '../useForm';
import { generateFieldClasses } from '../styles/utils';
import { StyleOverrides } from '../styles/types';

interface SliderFieldProps {
  spec: FieldSpec;
  path: string;
  value: number;
  onChange: (value: number) => void;
  error?: string[];
  registerRef?: (path: string, ref: any) => void;
  styleOverrides?: StyleOverrides;
}

export interface FieldRef {
  setValue: (value: any) => void;
  getValue: () => any;
  focus?: () => void;
}

const SliderField = forwardRef<FieldRef, SliderFieldProps>(
  ({ spec, path, value, onChange, error, registerRef, styleOverrides }, ref) => {
    const sliderRef = useRef<HTMLInputElement>(null);
    const fieldClasses = generateFieldClasses(path, 'slider', styleOverrides);
  
    useImperativeHandle(ref, () => ({
      setValue: (newValue: number) => {
        onChange(newValue);
      },
      getValue: () => value,
      focus: () => sliderRef.current?.focus()
    }));

    useEffect(() => {
      if (registerRef && ref) {
        registerRef(path, ref);
      }
    }, [path, registerRef, ref]);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value);
      onChange(newValue);
    };
  
    const displayValue = (value || 0).toFixed(spec.step && spec.step < 1 ? 1 : 0);

    return (
      <div className={`${fieldClasses} slider-wrapper`}>
        <div className="slider-header">
          <label htmlFor={path}>{spec.label}</label>
          <span className="slider-value">{displayValue}</span>
        </div>
        <input
          ref={sliderRef}
          type="range"
          id={path}
          min={spec.min || 0}
          max={spec.max || 100}
          step={spec.step || 0.1}
          value={value || 0}
          onChange={handleChange}
          aria-invalid={!!error && error.length > 0}
        />
        <div className="slider-bounds">
          <span className="slider-min">{spec.min || 0}</span>
          <span className="slider-max">{spec.max || 100}</span>
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

SliderField.displayName = 'SliderField';

export default SliderField;