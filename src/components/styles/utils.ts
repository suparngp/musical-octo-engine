import { StyleOverrides, FieldStyles, GroupStyles, FormStyles } from './types';

// Default styles for each field type
const defaultFieldStyles: Record<string, Partial<FieldStyles>> = {
  input: {
    labelFontSize: 'md',
    labelFontWeight: 'normal',
    inputBorderRadius: 'sm',
    gap: 'sm',
    marginBottom: 'md',
    labelColor: '#374151',
    inputBorderColor: '#d1d5db',
    inputTextColor: '#111827',
    focusBorderColor: '#3b82f6',
    errorBorderColor: '#dc2626',
    errorTextColor: '#dc2626'
  },
  select: {
    labelFontSize: 'md',
    labelFontWeight: 'normal',
    inputBorderRadius: 'sm',
    gap: 'sm',
    marginBottom: 'md',
    labelColor: '#374151',
    inputBorderColor: '#d1d5db',
    inputTextColor: '#111827',
    focusBorderColor: '#3b82f6',
    errorBorderColor: '#dc2626',
    errorTextColor: '#dc2626'
  },
  radio: {
    labelFontSize: 'md',
    labelFontWeight: 'normal',
    gap: 'sm',
    marginBottom: 'md',
    labelColor: '#374151',
    errorTextColor: '#dc2626'
  },
  checkbox: {
    labelFontSize: 'md',
    labelFontWeight: 'normal',
    gap: 'sm',
    marginBottom: 'md',
    labelColor: '#374151',
    errorTextColor: '#dc2626'
  },
  slider: {
    labelFontSize: 'md',
    labelFontWeight: 'normal',
    gap: 'sm',
    marginBottom: 'md',
    labelColor: '#374151',
    errorTextColor: '#dc2626'
  }
};

const defaultGroupStyles: Partial<GroupStyles> = {
  headerFontSize: 'lg',
  headerFontWeight: 'medium',
  headerColor: '#111827',
  borderStyle: 'none',
  padding: 'md'
};

const defaultFormStyles: Partial<FormStyles> = {
  maxWidth: 'lg',
  gap: 'lg',
  padding: 'md'
};

/**
 * Resolves field styles by merging defaults with overrides in priority order
 */
export function resolveFieldStyles(
  path: string,
  fieldType: string,
  styleOverrides?: StyleOverrides
): Partial<FieldStyles> {
  if (!styleOverrides) {
    return defaultFieldStyles[fieldType] || {};
  }

  return {
    ...defaultFieldStyles[fieldType],
    ...styleOverrides.form,
    ...styleOverrides.fieldTypes?.[fieldType as keyof typeof styleOverrides.fieldTypes],
    ...styleOverrides.fields?.[path]
  };
}

/**
 * Resolves group styles by merging defaults with overrides
 */
export function resolveGroupStyles(styleOverrides?: StyleOverrides): Partial<GroupStyles> {
  if (!styleOverrides) {
    return defaultGroupStyles;
  }

  return {
    ...defaultGroupStyles,
    ...styleOverrides.groups
  };
}

/**
 * Resolves form styles by merging defaults with overrides
 */
export function resolveFormStyles(styleOverrides?: StyleOverrides): Partial<FormStyles> {
  if (!styleOverrides) {
    return defaultFormStyles;
  }

  return {
    ...defaultFormStyles,
    ...styleOverrides.form
  };
}

/**
 * Generates CSS class names based on resolved styles
 */
export function generateFieldClasses(
  path: string,
  fieldType: string,
  styleOverrides?: StyleOverrides
): string {
  const resolvedStyles = resolveFieldStyles(path, fieldType, styleOverrides);
  
  const classes = [
    'field-wrapper',
    `field-${fieldType}`
  ];
  
  // Add modifier classes based on resolved styles
  if (resolvedStyles.inputBorderRadius && resolvedStyles.inputBorderRadius !== 'sm') {
    classes.push(`radius-${resolvedStyles.inputBorderRadius}`);
  }
  
  if (resolvedStyles.labelFontWeight && resolvedStyles.labelFontWeight !== 'normal') {
    classes.push(`label-${resolvedStyles.labelFontWeight}`);
  }
  
  if (resolvedStyles.labelFontSize && resolvedStyles.labelFontSize !== 'md') {
    classes.push(`label-size-${resolvedStyles.labelFontSize}`);
  }
  
  if (resolvedStyles.gap && resolvedStyles.gap !== 'sm') {
    classes.push(`gap-${resolvedStyles.gap}`);
  }
  
  if (resolvedStyles.marginBottom && resolvedStyles.marginBottom !== 'md') {
    classes.push(`mb-${resolvedStyles.marginBottom}`);
  }

  return classes.join(' ');
}

/**
 * Generates CSS class names for groups
 */
export function generateGroupClasses(styleOverrides?: StyleOverrides): string {
  const resolvedStyles = resolveGroupStyles(styleOverrides);
  
  const classes = ['form-group'];
  
  if (resolvedStyles.headerFontSize && resolvedStyles.headerFontSize !== 'lg') {
    classes.push(`header-size-${resolvedStyles.headerFontSize}`);
  }
  
  if (resolvedStyles.headerFontWeight && resolvedStyles.headerFontWeight !== 'medium') {
    classes.push(`header-${resolvedStyles.headerFontWeight}`);
  }
  
  if (resolvedStyles.borderStyle && resolvedStyles.borderStyle !== 'none') {
    classes.push(`border-${resolvedStyles.borderStyle}`);
  }
  
  if (resolvedStyles.borderRadius) {
    classes.push(`radius-${resolvedStyles.borderRadius}`);
  }
  
  if (resolvedStyles.padding && resolvedStyles.padding !== 'md') {
    classes.push(`p-${resolvedStyles.padding}`);
  }

  return classes.join(' ');
}

/**
 * Generates CSS class names for the form container
 */
export function generateFormClasses(styleOverrides?: StyleOverrides): string {
  const resolvedStyles = resolveFormStyles(styleOverrides);
  
  const classes = ['form-container'];
  
  if (resolvedStyles.maxWidth && resolvedStyles.maxWidth !== 'lg') {
    classes.push(`max-w-${resolvedStyles.maxWidth}`);
  }
  
  if (resolvedStyles.gap && resolvedStyles.gap !== 'lg') {
    classes.push(`gap-${resolvedStyles.gap}`);
  }
  
  if (resolvedStyles.padding && resolvedStyles.padding !== 'md') {
    classes.push(`p-${resolvedStyles.padding}`);
  }

  return classes.join(' ');
}