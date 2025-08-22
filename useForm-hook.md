# useForm Hook API

## Hook Signature

```tsx
const [formState, formAPI] = useForm(spec);
```

## FormState
Complete reactive state object matching the form structure. Updates automatically when form values change.

```tsx
// Example formState structure
{
  profile: {
    displayName: '',
    fullName: 'John Doe'
  },
  settings: {
    appearance: {
      font: 'Lato',
      colorMode: 'dark',
      fontScale: 1.0
    }
  }
}
```

## FormAPI Interface

```tsx
interface FormAPI {
  // Set multiple values at once
  setValues: (values: any) => void;
  
  // Set single field value by path
  setValue: (path: string, value: any) => void;
  
  // Get all form values
  getValues: () => any;
  
  // Get single field value by path
  getValue: (path: string) => any;
  
  // Reset form to initial default values
  reset: () => void;
  
  // Run all validators and return results
  validate: () => Promise<ValidationResults>;
  
  // Direct access to field refs
  refs: any;
}
```

## Usage Examples

```tsx
function MyForm() {
  const [formState, formAPI] = useForm(myFormSpec);

  // Read current state
  const displayName = formState.profile.displayName;
  const font = formState.settings.appearance.font;

  // Update single field
  formAPI.setValue('profile.displayName', 'Jane');
  formAPI.setValue('settings.appearance.font', 'Arial');

  // Update multiple fields
  formAPI.setValues({
    profile: {
      displayName: 'Jane',
      fullName: 'Jane Smith'
    },
    settings: {
      appearance: {
        font: 'Roboto',
        colorMode: 'light',
        fontScale: 1.2
      }
    }
  });

  // Get values programmatically
  const currentFont = formAPI.getValue('settings.appearance.font');
  const allValues = formAPI.getValues();

  // Reset to defaults
  formAPI.reset();

  // Validate form
  const handleSubmit = async () => {
    const errors = await formAPI.validate();
    if (Object.keys(errors).length === 0) {
      // Form is valid
      console.log('Submitting:', formAPI.getValues());
    }
  };

  return (
    <DynamicForm 
      spec={myFormSpec}
      state={formState}
      api={formAPI}
    />
  );
}
```

## Path Notation
Use dot notation to access nested fields:
- `'profile.displayName'`
- `'settings.appearance.font'`
- `'settings.notifications.marketing.email'`

## ValidationResults Type

```tsx
type ValidationResults = {
  [fieldPath: string]: string[]; // Array of error messages per field
};
```

## Helper Functions (Internal)

```tsx
// Get nested value by path
const getValueByPath = (obj: any, path: string) => {
  return path.split('.').reduce((curr, key) => curr?.[key], obj);
};

// Set nested value by path
const setValueByPath = (obj: any, path: string, value: any) => {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((curr, key) => {
    if (!curr[key]) curr[key] = {};
    return curr[key];
  }, obj);
  target[lastKey] = value;
};

// Initialize state from spec defaults
const getInitialState = (schema: any): any => {
  const state: any = {};
  
  Object.keys(schema).forEach(key => {
    const field = schema[key];
    
    if (field.type) {
      state[key] = field.defaultValue ?? getDefaultForType(field.type);
    } else if (field.label) {
      const groupFields = { ...field };
      delete groupFields.label;
      state[key] = getInitialState(groupFields);
    }
  });
  
  return state;
};
```