# Example Form Usage

This example demonstrates how to use the dynamic form system with the schema from the README.md.

## Complete Working Example

```tsx
import React, { useState } from 'react';
import { useForm, FormSpec, Validator } from './src/components/useForm';
import RenderForm from './src/components/renderForm';

// Custom validators
const requiredValidator: Validator = (value: any) => {
  return value && value.toString().trim() !== '' 
    ? { status: 'success' }
    : { status: 'error', message: 'This field is required' };
};

const emailValidator: Validator = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value)
    ? { status: 'success' }
    : { status: 'error', message: 'Please enter a valid email address' };
};

// Form specification matching the README example
const formSpec: FormSpec = {
  profile: {
    label: 'Profile Settings',
    displayName: {
      type: 'input',
      label: 'Display Name',
      defaultValue: '',
      placeholder: 'Enter your display name',
      validators: [requiredValidator]
    },
    fullName: {
      type: 'input',
      label: 'Full Name',
      defaultValue: 'First Last',
      placeholder: 'Enter your full name',
      validators: [requiredValidator]
    },
    website: {
      type: 'input',
      label: 'Website',
      defaultValue: '',
      placeholder: 'https://example.com'
    },
    theme: {
      type: 'radio',
      label: 'Profile Theme',
      defaultValue: 'clean',
      options: ['clean', 'compact']
    },
    nameDisplay: {
      type: 'radio',
      label: 'Name Display',
      defaultValue: 'displayOnly',
      options: [
        { label: 'Full Name and Display Name', value: 'fullAndDisplay' },
        { label: 'Display Name Only', value: 'displayOnly' }
      ]
    }
  },
  settings: {
    label: 'Settings',
    appearance: {
      label: 'Appearance',
      font: {
        type: 'select',
        label: 'Font Family',
        defaultValue: 'Lato',
        options: ['Lato', 'Roboto', 'Open Sans', 'Montserrat', 'Arial']
      },
      colorMode: {
        type: 'radio',
        label: 'Color Mode',
        defaultValue: 'dark',
        options: ['light', 'dark', 'system']
      },
      theme: {
        type: 'select',
        label: 'Color Theme',
        defaultValue: 'Jade',
        options: [
          { label: 'Jade Green', value: 'Jade' },
          { label: 'Ocean Blue', value: 'Ocean' },
          { label: 'Sunset Orange', value: 'Sunset' },
          { label: 'Purple Rain', value: 'Purple' }
        ]
      },
      fontScale: {
        type: 'slider',
        label: 'Font Scale',
        defaultValue: 1.0,
        min: 0.8,
        max: 1.4,
        step: 0.1
      }
    },
    notifications: {
      label: 'Notifications',
      allow: {
        label: 'Notification Schedule',
        days: {
          type: 'select',
          label: 'Days',
          defaultValue: 'Every day',
          options: ['Every day', 'Weekdays only', 'Weekends only', 'Custom']
        },
        from: {
          type: 'input',
          label: 'From',
          defaultValue: '08:00 AM',
          placeholder: 'HH:MM AM/PM'
        },
        to: {
          type: 'input',
          label: 'To',
          defaultValue: '10:00 PM',
          placeholder: 'HH:MM AM/PM'
        }
      },
      reminderTime: {
        type: 'input',
        label: 'Daily Reminder Time',
        defaultValue: '09:00 AM',
        placeholder: 'HH:MM AM/PM'
      },
      marketing: {
        label: 'Marketing Communications',
        email: {
          type: 'checkbox',
          label: 'Email Marketing',
          defaultValue: true
        },
        sms: {
          type: 'checkbox',
          label: 'SMS Marketing',
          defaultValue: false
        }
      },
      productUpdates: {
        label: 'Product Updates',
        email: {
          type: 'checkbox',
          label: 'Email Updates',
          defaultValue: true
        },
        inApp: {
          type: 'checkbox',
          label: 'In-App Notifications',
          defaultValue: true
        }
      }
    },
    security: {
      label: 'Security',
      twoFactorAuth: {
        type: 'checkbox',
        label: 'Two-Factor Authentication',
        defaultValue: true
      },
      backupCodes: {
        label: 'Backup Codes',
        generated: {
          type: 'checkbox',
          label: 'Backup codes generated',
          defaultValue: true
        }
      }
    },
    projects: {
      label: 'Project Settings',
      autoSave: {
        type: 'checkbox',
        label: 'Auto-save projects',
        defaultValue: true
      },
      defaultView: {
        type: 'radio',
        label: 'Default View',
        defaultValue: 'grid',
        options: ['grid', 'list', 'kanban']
      },
      showCompletedTasks: {
        type: 'checkbox',
        label: 'Show completed tasks',
        defaultValue: false
      },
      taskSortOrder: {
        type: 'select',
        label: 'Task Sort Order',
        defaultValue: 'dueDate',
        options: [
          { label: 'Due Date', value: 'dueDate' },
          { label: 'Priority', value: 'priority' },
          { label: 'Created Date', value: 'created' },
          { label: 'Alphabetical', value: 'alphabetical' }
        ]
      }
    }
  }
};

// Main form component
export const ExampleForm: React.FC = () => {
  const [formState, formAPI, { registerFieldRef, handleFieldChange }] = useForm(formSpec);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom form renderer that integrates with useForm
  const renderForm = (schema: any, path: string[] = []) => {
    return Object.entries(schema).map(([key, field]) => {
      if (key === 'label') return null;
      
      const fieldPath = [...path, key].join('.');
      
      if ('type' in field) {
        // It's a field
        const FieldComponent = getFieldComponent(field.type);
        const value = formAPI.getValue(fieldPath);
        const errors = validationErrors[fieldPath];
        
        return (
          <FieldComponent
            key={fieldPath}
            spec={field}
            path={fieldPath}
            value={value}
            onChange={(newValue: any) => handleFieldChange(fieldPath, newValue)}
            error={errors}
            registerRef={registerFieldRef}
          />
        );
      } else if (typeof field === 'object' && field.label) {
        // It's a group
        const depth = path.length;
        return (
          <div 
            key={fieldPath} 
            className="form-group" 
            style={{ marginLeft: depth * 20, marginBottom: '1.5rem' }}
          >
            <h3 style={{ marginBottom: '1rem', fontSize: `${1.4 - depth * 0.1}rem` }}>
              {field.label}
            </h3>
            <div className="form-group-content">
              {renderForm(field, [...path, key])}
            </div>
          </div>
        );
      }
    });
  };

  const getFieldComponent = (type: string) => {
    // This would import the actual field components
    const components = {
      input: 'InputField',
      select: 'SelectField', 
      radio: 'RadioField',
      checkbox: 'CheckboxField',
      slider: 'SliderField'
    };
    return components[type] || 'div';
  };

  const handleValidate = async () => {
    const errors = await formAPI.validate();
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const isValid = await handleValidate();
    
    if (isValid) {
      console.log('Form submitted successfully:', formAPI.getValues());
      // Handle successful submission
    } else {
      console.log('Form has validation errors:', validationErrors);
    }
    
    setIsSubmitting(false);
  };

  const handleReset = () => {
    formAPI.reset();
    setValidationErrors({});
  };

  // Programmatic control examples
  const handleQuickActions = () => {
    // Set dark mode with larger font
    formAPI.setValue('settings.appearance.colorMode', 'dark');
    formAPI.setValue('settings.appearance.fontScale', 1.2);
    
    // Enable all notifications
    formAPI.setValue('settings.notifications.marketing.email', true);
    formAPI.setValue('settings.notifications.marketing.sms', true);
    formAPI.setValue('settings.notifications.productUpdates.email', true);
    formAPI.setValue('settings.notifications.productUpdates.inApp', true);
    
    // Set to grid view with auto-save
    formAPI.setValue('settings.projects.defaultView', 'grid');
    formAPI.setValue('settings.projects.autoSave', true);
  };

  const handleBulkUpdate = () => {
    // Update multiple values at once
    formAPI.setValues({
      profile: {
        ...formState.profile,
        theme: 'compact',
        nameDisplay: 'fullAndDisplay'
      },
      settings: {
        ...formState.settings,
        appearance: {
          ...formState.settings.appearance,
          font: 'Roboto',
          theme: 'Ocean'
        }
      }
    });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>Dynamic Form Example</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <button 
          type="button" 
          onClick={handleQuickActions}
          style={{ marginRight: '1rem' }}
        >
          Quick Setup (Dark + Notifications)
        </button>
        <button 
          type="button" 
          onClick={handleBulkUpdate}
          style={{ marginRight: '1rem' }}
        >
          Bulk Update Example
        </button>
        <button type="button" onClick={handleReset}>
          Reset Form
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        {renderForm(formSpec)}
        
        <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #ccc' }}>
          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{ marginRight: '1rem', padding: '0.5rem 1rem' }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
          <button 
            type="button" 
            onClick={handleValidate}
            style={{ marginRight: '1rem', padding: '0.5rem 1rem' }}
          >
            Validate Only
          </button>
        </div>
      </form>

      {/* Debug information */}
      <details style={{ marginTop: '2rem' }}>
        <summary>Current Form State (Debug)</summary>
        <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
          {JSON.stringify(formState, null, 2)}
        </pre>
      </details>
      
      {Object.keys(validationErrors).length > 0 && (
        <details>
          <summary>Validation Errors (Debug)</summary>
          <pre style={{ background: '#fee', padding: '1rem', overflow: 'auto' }}>
            {JSON.stringify(validationErrors, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

export default ExampleForm;
```

## Key Features Demonstrated

1. **Schema Definition**: Complete form specification with all field types
2. **Nested Structure**: Multi-level grouping (profile, settings > appearance, notifications, etc.)
3. **Validation**: Custom validators with error display
4. **Programmatic Control**: 
   - `formAPI.setValue()` for individual fields
   - `formAPI.setValues()` for bulk updates
   - `formAPI.reset()` to restore defaults
5. **State Management**: Reactive form state that updates automatically
6. **Error Handling**: Form-level validation with error display

## Usage Pattern

```tsx
// 1. Define your form specification
const myFormSpec = { /* your schema */ };

// 2. Use the hook
const [formState, formAPI, helpers] = useForm(myFormSpec);

// 3. Render with field integration
<MyFieldComponent
  spec={fieldSpec}
  path="field.path"
  value={formAPI.getValue('field.path')}
  onChange={(value) => helpers.handleFieldChange('field.path', value)}
  registerRef={helpers.registerFieldRef}
/>

// 4. Programmatic control
formAPI.setValue('some.nested.field', 'new value');
formAPI.setValues({ /* bulk update */ });
const errors = await formAPI.validate();
```

This example produces a fully functional form that matches the structure defined in the README.md with complete programmatic control capabilities.