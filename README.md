# Dynamic JSON Form 

Your task is to design and implement a JSON schema system that can dynamically generate form components and manage form state.

## Requirements:

1. **Define a JSON Schema Structure** that can specify:
  - Field types (input, select, checkbox, radio, slider, etc.)
  - UI labels and display properties
  - Options for select/radio components
  - Default values
  - Validation rules (regex patterns, custom functions, etc.)
2. **Generate Form Components** from your schema that can:
  - Render the appropriate UI elements based on field types
  - Handle deeply nested object structures
3. **Manage Form State** with functionality to:
  - Initialize state with default or previously saved values
  - Update state when users interact with form elements
  - Reset form to initial values

## Expected Deliverables:

- Your JSON schema definition/structure
- A working form component that renders from the schema
- State management logic that handles updates and resets

Example State Structure to Support:

```ts
const initialState = {
  profile: {
    displayName: '',
    fullName: 'First Last',
    website: '',
    theme: 'clean', // radio: 'clean' | 'compact'
    nameDisplay: 'displayOnly', // radio: 'fullAndDisplay' | 'displayOnly'
  },
  settings: {
    appearance: {
      font: 'Lato', // select: font family
      colorMode: 'dark', // radio: 'light' | 'dark' | 'system'
      theme: 'Jade', // select: color themes
      fontScale: 1.0, // slider: 0.8 - 1.4
    },
    notifications: {
      allow: {
        days: 'Every day',
        from: '08:00 AM',
        to: '10:00 PM',
      },
      reminderTime: '09:00 AM',
      marketing: {
        email: true,
        sms: false,
      },
      productUpdates: {
        email: true,
        inApp: true,
      },
    },
    security: {
      twoFactorAuth: true,
      backupCodes: {
        generated: true,
      },
    },
    projects: {
      autoSave: true,
      defaultView: 'grid', // radio: 'grid' | 'list' | 'kanban'
      showCompletedTasks: false, // checkbox
      taskSortOrder: 'dueDate', // select: 'dueDate' | 'priority' | 'created' | 'alphabetical'
    },
  },
};
```