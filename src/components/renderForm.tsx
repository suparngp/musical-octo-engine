import './styles/form.css';

import { generateFormClasses, generateGroupClasses } from './styles/utils';

import FormComponent from './FormComponent';
import React from 'react';
import type { StyleOverrides } from './styles/types';

export type ValidationState = {
  status: 'success' | 'error';
  message?: string;
};

export type Validator = (value: any) => ValidationState;

export type InputField = {
  type: 'input';
  label: string;
  defaultValue: string;
  validators: Validator[];
  placeholder?: string;
};

export type RadioField = {
  type: 'radio';
  label: string;
  defaultValue: string;
  options: string[];
  validators: Validator[];
};

export type SelectField = {
  type: 'select';
  label: string;
  defaultValue: string;
  options: string[];
  validators: Validator[];
};

export type CheckboxField = {
  type: 'checkbox';
  label: string;
  defaultValue: boolean;
  validators: Validator[];
};

export type SliderField = {
  type: 'slider';
  label: string;
  defaultValue: number;
  min: number;
  max: number;
  step?: number;
  validators: Validator[];
};

export type FieldSpec = InputField | RadioField | SelectField | CheckboxField | SliderField;

export type GroupSpec = {
  label: string;
  [key: string]: FieldSpec | GroupSpec | string;
};

export type SchemaItem = FieldSpec | GroupSpec;

export type SchemaStructure = {
  [key: string]: SchemaItem;
};

interface RenderFormProps {
  schema: SchemaStructure;
  path?: string[];
  styleOverrides?: StyleOverrides;
}

function isFieldSpec(spec: any): spec is FieldSpec {
  return spec && typeof spec === 'object' && 'type' in spec;
}

function isGroupSpec(spec: any): spec is GroupSpec {
  return spec && typeof spec === 'object' && 'label' in spec && !('type' in spec);
}

const RenderForm: React.FC<RenderFormProps> = ({ schema, path = [], styleOverrides }) => {
  const formClasses = generateFormClasses(styleOverrides);
  const groupClasses = generateGroupClasses(styleOverrides);
  
  return React.createElement(
    'div',
    { className: formClasses },
    Object.entries(schema).map(([key, spec]) => {
      const currentPath = [...path, key];
      const pathString = currentPath.join('.');

      if (isFieldSpec(spec)) {
        return React.createElement(FormComponent, {
          key: pathString,
          spec: {
            ...spec,
            path: currentPath,
            fieldKey: key
          },
          styleOverrides
        });
      }

      if (isGroupSpec(spec)) {
        const { label, ...nestedFields } = spec;
        
        return React.createElement(
          'div',
          { key: pathString, className: groupClasses },
          React.createElement('h3', { className: 'form-group-label' }, label),
          React.createElement(
            'div',
            { className: 'form-group-content' },
            React.createElement(RenderForm, {
              schema: nestedFields as SchemaStructure,
              path: currentPath,
              styleOverrides
            })
          )
        );
      }

      return null;
    })
  );
};

export default RenderForm;