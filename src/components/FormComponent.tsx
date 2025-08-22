import CheckboxField from './fields/CheckboxField';
import type { FieldSpec } from './renderForm';
import InputField from './fields/InputField';
import RadioField from './fields/RadioField';
import React from 'react';
import SelectField from './fields/SelectField';
import SliderField from './fields/SliderField';
import type { StyleOverrides } from './styles/types';

export interface FormComponentProps {
  spec: FieldSpec & {
    path: string[];
    fieldKey: string;
  };
  styleOverrides?: StyleOverrides;
}

const FormComponent: React.FC<FormComponentProps> = ({ spec, styleOverrides }) => {
  const { path, fieldKey, ...fieldSpec } = spec;
  
  switch (fieldSpec.type) {
    case 'input':
      return (
        <InputField
          spec={fieldSpec}
          path={path.join('.')}
          fieldKey={fieldKey}
          styleOverrides={styleOverrides}
        />
      );
      
    case 'radio':
      return (
        <RadioField
          spec={fieldSpec}
          path={path}
          fieldKey={fieldKey}
          styleOverrides={styleOverrides}
        />
      );
      
    case 'select':
      return (
        <SelectField
          spec={fieldSpec}
          path={path}
          fieldKey={fieldKey}
          styleOverrides={styleOverrides}
        />
      );
      
    case 'checkbox':
      return (
        <CheckboxField
          spec={fieldSpec}
          path={path}
          fieldKey={fieldKey}
          styleOverrides={styleOverrides}
        />
      );
      
    case 'slider':
      return (
        <SliderField
          spec={fieldSpec}
          path={path}
          fieldKey={fieldKey}
          styleOverrides={styleOverrides}
        />
      );
      
    default:
      return null;
  }
};

export default FormComponent;