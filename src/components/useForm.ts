/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useRef, useState } from 'react';

export type ValidationState = {
  status: 'success' | 'error';
  message?: string;
};

export type Validator = (value: any) => ValidationState | Promise<ValidationState>;

export type ValidationResults = {
  [fieldPath: string]: string[];
};

export interface FieldSpec {
  type: 'input' | 'select' | 'radio' | 'checkbox' | 'slider';
  label: string;
  defaultValue?: any;
  placeholder?: string;
  options?: string[] | { label: string; value: any }[];
  min?: number;
  max?: number;
  step?: number;
  validators?: Validator[];
}

export interface GroupSpec {
  label: string;
  [key: string]: FieldSpec | GroupSpec | string;
}

export type FormSpec = {
  [key: string]: FieldSpec | GroupSpec;
};

export interface FormAPI {
  setValues: (values: any) => void;
  setValue: (path: string, value: any) => void;
  getValues: () => any;
  getValue: (path: string) => any;
  reset: () => void;
  validate: () => Promise<ValidationResults>;
  refs: Record<string, any>;
}

const getDefaultForType = (type: string): any => {
  switch (type) {
    case 'checkbox':
      return false;
    case 'slider':
      return 0;
    case 'input':
    case 'select':
    case 'radio':
    default:
      return '';
  }
};

const getValueByPath = (obj: any, path: string): any => {
  return path.split('.').reduce((curr, key) => curr?.[key], obj);
};

const setValueByPath = (obj: any, path: string, value: any): void => {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((curr, key) => {
    if (!curr[key]) curr[key] = {};
    return curr[key];
  }, obj);
  target[lastKey] = value;
};

const getInitialState = (schema: FormSpec | GroupSpec): any => {
  const state: any = {};

  Object.keys(schema).forEach((key) => {
    if (key === 'label') return;

    const field = schema[key as keyof typeof schema] as FieldSpec | GroupSpec;

    if ('type' in field) {
      state[key] = field.defaultValue ?? getDefaultForType(field.type);
    } else if (typeof field === 'object' && field.label) {
      state[key] = getInitialState(field);
    }
  });

  return state;
};

export const useForm = (spec: FormSpec) => {
  const [formState, setFormState] = useState(() => getInitialState(spec));
  const fieldRefs = useRef<Record<string, any>>({});
  const initialState = useRef(getInitialState(spec));

  const setValues = useCallback((values: any) => {
    setFormState(values);

    const updateRefs = (vals: any, path: string[] = []) => {
      Object.keys(vals).forEach((key) => {
        const fieldPath = [...path, key].join('.');
        const value = vals[key];

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          updateRefs(value, [...path, key]);
        } else {
          fieldRefs.current[fieldPath]?.setValue?.(value);
        }
      });
    };
    updateRefs(values);
  }, []);

  const setValue = useCallback((path: string, value: any) => {
    setFormState((prev) => {
      const newState = JSON.parse(JSON.stringify(prev));
      setValueByPath(newState, path, value);
      return newState;
    });
    fieldRefs.current[path]?.setValue?.(value);
  }, []);

  const getValues = useCallback(() => formState, [formState]);

  const getValue = useCallback(
    (path: string) => {
      return getValueByPath(formState, path);
    },
    [formState]
  );

  const reset = useCallback(() => {
    const initial = initialState.current;
    setFormState(JSON.parse(JSON.stringify(initial)));
    setValues(JSON.parse(JSON.stringify(initial)));
  }, [setValues]);

  const validate = useCallback(async (): Promise<ValidationResults> => {
    const results: ValidationResults = {};

    const validateFields = async (schema: FormSpec | GroupSpec, state: any, path: string[] = []): Promise<void> => {
      for (const key of Object.keys(schema)) {
        if (key === 'label') continue;

        const field = schema[key as keyof typeof schema] as FieldSpec | GroupSpec;
        const fieldPath = [...path, key].join('.');

        if ('type' in field && field.validators) {
          const value = getValueByPath(state, fieldPath);
          const errors: string[] = [];

          for (const validator of field.validators) {
            const result = await validator(value);
            if (result.status === 'error' && result.message) {
              errors.push(result.message);
            }
          }

          if (errors.length > 0) {
            results[fieldPath] = errors;
          }
        } else if (typeof field === 'object' && field.label) {
          await validateFields(field, state, [...path, key]);
        }
      }
    };

    await validateFields(spec, formState);
    return results;
  }, [spec, formState]);

  const registerFieldRef = useCallback((path: string, ref: any) => {
    fieldRefs.current[path] = ref;
  }, []);

  const handleFieldChange = useCallback((path: string, value: any) => {
    setFormState((prev) => {
      const newState = JSON.parse(JSON.stringify(prev));
      setValueByPath(newState, path, value);
      return newState;
    });
  }, []);

  const formAPI: FormAPI = {
    setValues,
    setValue,
    getValues,
    getValue,
    reset,
    validate,
    refs: fieldRefs.current,
  };

  return [formState, formAPI, { registerFieldRef, handleFieldChange }] as const;
};
