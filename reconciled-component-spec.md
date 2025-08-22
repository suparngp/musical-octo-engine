# Reconciled Form Component Specification

## Core Principle
The form API (useForm hook) is the source of truth. React components should work with the schema-based approach and integrate with the useForm hook's state management.

## Field Component Props Interface

Based on the useForm hook implementation, field components should receive:

```tsx
interface BaseFieldProps {
  spec: FieldSpec;           // Contains type, label, validators, options, etc.
  value: any;                 // Current value from formState
  onChange: (value: any) => void;  // Calls handleFieldChange(path, value)
  path: string;               // Dot-notation path (e.g., 'settings.appearance.font')
  error?: string[];           // Validation errors from formAPI.validate()
  registerRef?: (path: string, ref: any) => void;  // From useForm hook
}
```

## FieldSpec Structure (from useForm.ts)

```tsx
interface FieldSpec {
  type: 'input' | 'select' | 'radio' | 'checkbox' | 'slider';
  label: string;
  defaultValue?: any;
  placeholder?: string;
  options?: string[] | { label: string; value: any }[];
  min?: number;              // For slider
  max?: number;              // For slider
  step?: number;             // For slider
  validators?: Validator[];
}
```

## Field Component Ref Interface

Components should expose these methods via forwardRef:

```tsx
interface FieldRef {
  setValue: (value: any) => void;
  getValue: () => any;
  focus?: () => void;  // Optional, only for focusable elements
}
```

## Integration Pattern

### 1. Field Component Implementation

```tsx
const InputField = forwardRef<FieldRef, BaseFieldProps>(
  ({ spec, value, onChange, path, error, registerRef }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      setValue: (newValue: any) => {
        onChange(newValue);
      },
      getValue: () => value,
      focus: () => inputRef.current?.focus()
    }));

    useEffect(() => {
      if (registerRef && ref) {
        registerRef(path, ref);
      }
    }, [path, registerRef, ref]);

    return (
      <div className="form-field">
        <label>{spec.label}</label>
        <input
          ref={inputRef}
          type="text"
          value={value || ''}
          placeholder={spec.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        {error && error.map((err, i) => (
          <span key={i} className="error-message">{err}</span>
        ))}
      </div>
    );
  }
);
```

### 2. Form Renderer Integration

```tsx
function DynamicForm({ spec }: { spec: FormSpec }) {
  const [formState, formAPI, { registerFieldRef, handleFieldChange }] = useForm(spec);
  const [validationErrors, setValidationErrors] = useState<ValidationResults>({});

  const renderField = (fieldSpec: FieldSpec, fieldPath: string) => {
    const value = formAPI.getValue(fieldPath);
    const errors = validationErrors[fieldPath];

    const commonProps = {
      spec: fieldSpec,
      value,
      onChange: (newValue: any) => handleFieldChange(fieldPath, newValue),
      path: fieldPath,
      error: errors,
      registerRef: registerFieldRef
    };

    switch (fieldSpec.type) {
      case 'input':
        return <InputField {...commonProps} />;
      case 'select':
        return <SelectField {...commonProps} />;
      case 'radio':
        return <RadioField {...commonProps} />;
      case 'checkbox':
        return <CheckboxField {...commonProps} />;
      case 'slider':
        return <SliderField {...commonProps} />;
    }
  };

  const renderForm = (schema: FormSpec | GroupSpec, path: string[] = []) => {
    return Object.entries(schema).map(([key, field]) => {
      if (key === 'label') return null;
      
      const fieldPath = [...path, key].join('.');
      
      if ('type' in field) {
        // It's a field
        return (
          <div key={fieldPath}>
            {renderField(field as FieldSpec, fieldPath)}
          </div>
        );
      } else if (typeof field === 'object' && field.label) {
        // It's a group
        const depth = path.length;
        return (
          <div key={fieldPath} className="form-group" style={{ marginLeft: depth * 20 }}>
            <h3>{field.label}</h3>
            {renderForm(field as GroupSpec, [...path, key])}
          </div>
        );
      }
    });
  };

  const handleValidate = async () => {
    const errors = await formAPI.validate();
    setValidationErrors(errors);
  };

  return (
    <div>
      {renderForm(spec)}
      <button onClick={handleValidate}>Validate</button>
    </div>
  );
}
```

## Key Reconciliation Points

### What Stays from Original Spec:
1. **Ref methods** (setValue, getValue, focus) - Required for programmatic control
2. **Validation state object** - Not boolean, returns {status, message}
3. **Nested structure support** - Recursive rendering with indentation
4. **FormAPI methods** - All methods from useForm hook remain unchanged

### What Changes from Original Component Spec:
1. **Props structure** - Components receive `spec` object instead of flat props
2. **Path-based updates** - Use dot-notation paths instead of nested refs
3. **Error handling** - Errors come from validation results, not individual props
4. **onChange signature** - Simple value-only onChange, path handled by parent

### What the Current Implementation Got Right:
1. **Schema-driven approach** - Using spec objects to define fields
2. **Path management** - Dot-notation for nested fields
3. **Recursive rendering** - Proper handling of nested groups
4. **Validation architecture** - Validators in spec, not in components

### What Needs to be Added:
1. **forwardRef/useImperativeHandle** - For ref methods
2. **registerFieldRef integration** - Connect refs to useForm
3. **Validation error display** - Show errors from formAPI.validate()
4. **handleFieldChange usage** - Use the hook's change handler

## Summary

The reconciled specification maintains the schema-driven approach from the useForm hook while adding the necessary ref methods for programmatic control. Components work with spec objects rather than flat props, and the form renderer manages the integration between the useForm hook and the field components.