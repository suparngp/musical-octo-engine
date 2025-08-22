# JSON Form Schema Structure

## Field Types

### Input Field
```ts
{
  type: 'input',
  label: 'Display Name',
  defaultValue: '',
  placeholder?: 'Enter name',
  validators: []
}
```

### Radio Field
```ts
{
  type: 'radio',
  label: 'Color Mode',
  defaultValue: 'dark',
  options: ['light', 'dark', 'system'],
  validators: []
}
```

### Select Field
```ts
{
  type: 'select',
  label: 'Font',
  defaultValue: 'Lato',
  options: ['Lato', 'Roboto', 'Arial'],
  validators: []
}
```

### Checkbox Field
```ts
{
  type: 'checkbox',
  label: 'Email Notifications',
  defaultValue: true,
  validators: []
}
```

### Slider Field
```ts
{
  type: 'slider',
  label: 'Font Scale',
  defaultValue: 1.0,
  min: 0.8,
  max: 1.4,
  step?: 0.1,
  validators: []
}
```

## Nesting Structure

Groups are objects with a `label` property and nested fields/groups:

```ts
{
  profile: {
    label: 'Profile',
    displayName: { type: 'input', label: 'Display Name', defaultValue: '', validators: [] },
    fullName: { type: 'input', label: 'Full Name', defaultValue: 'First Last', validators: [] }
  },
  settings: {
    label: 'Settings',
    appearance: {
      label: 'Appearance',
      font: { type: 'select', label: 'Font', defaultValue: 'Lato', options: [...], validators: [] },
      colorMode: { type: 'radio', label: 'Color Mode', defaultValue: 'dark', options: [...], validators: [] },
      fontScale: { type: 'slider', label: 'Font Scale', defaultValue: 1.0, min: 0.8, max: 1.4, validators: [] }
    },
    notifications: {
      label: 'Notifications',
      marketing: {
        label: 'Marketing',
        email: { type: 'checkbox', label: 'Email', defaultValue: true, validators: [] },
        sms: { type: 'checkbox', label: 'SMS', defaultValue: false, validators: [] }
      }
    }
  }
}
```

## Validation Interface

```ts
type Validator = (value: any) => ValidationState;

type ValidationState = {
  status: 'success' | 'error'; // expandable to 'warning' | 'info' | 'pending'
  message?: string;
  // ... future fields
}
```

## Form State

Single flat JSON object matching the schema structure:

```ts
{
  profile: {
    displayName: '',
    fullName: 'First Last'
  },
  settings: {
    appearance: {
      font: 'Lato',
      colorMode: 'dark',
      fontScale: 1.0
    },
    notifications: {
      marketing: {
        email: true,
        sms: false
      }
    }
  }
}
```