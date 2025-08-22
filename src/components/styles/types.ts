export type FieldStyles = {
  // Typography
  labelColor?: string;
  labelFontSize?: 'sm' | 'md' | 'lg';
  labelFontWeight?: 'normal' | 'medium' | 'bold';
  
  // Input styling
  inputBackground?: string;
  inputBorderColor?: string;
  inputBorderRadius?: 'none' | 'sm' | 'md' | 'lg';
  inputTextColor?: string;
  
  // States
  focusBorderColor?: string;
  errorBorderColor?: string;
  errorTextColor?: string;
  
  // Spacing (relative, not absolute positioning)
  gap?: 'sm' | 'md' | 'lg'; // gap between label and input
  marginBottom?: 'sm' | 'md' | 'lg' | 'xl';
};

export type GroupStyles = {
  headerColor?: string;
  headerFontSize?: 'md' | 'lg' | 'xl';
  headerFontWeight?: 'normal' | 'medium' | 'bold';
  borderColor?: string;
  borderStyle?: 'none' | 'solid' | 'dashed';
  backgroundColor?: string;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg';
  padding?: 'sm' | 'md' | 'lg';
};

export type FormStyles = {
  backgroundColor?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  gap?: 'sm' | 'md' | 'lg' | 'xl';
};

export type StyleOverrides = {
  // Global form styles
  form?: FormStyles;
  
  // Component-level styles (applies to all instances of a field type)
  fieldTypes?: {
    input?: FieldStyles;
    radio?: FieldStyles;
    select?: FieldStyles;
    checkbox?: FieldStyles;
    slider?: FieldStyles;
  };
  
  // Group-level styles
  groups?: GroupStyles;
  
  // Individual field overrides (by path)
  fields?: {
    [path: string]: FieldStyles;
  };
};

export type ResolvedFieldStyles = Required<FieldStyles>;
export type ResolvedGroupStyles = Required<GroupStyles>;
export type ResolvedFormStyles = Required<FormStyles>;