'use client';

import { createContext, useContext, type FC, type ReactNode } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import { FormField } from '@/core/domain/entities/form';
import type { FieldType } from '@/core/domain/value-objects/field-types';

import type { FormBuilderData } from './form-builder-schema';
import { useFormBuilder } from './hooks/use-form-builder';

export interface FormBuilderContextValue {
  form: UseFormReturn<FormBuilderData>;
  fields: FormField[];
  selectedFieldId: string | null;
  selectedField: FormField | null;
  setSelectedFieldId: (id: string | null) => void;
  addField: (type: FieldType) => void;
  addFieldAt: (type: FieldType, index: number) => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  removeField: (id: string) => void;
  duplicateField: (id: string) => void;
  reorderFields: (activeId: string, overId: string) => void;
  addOption: (fieldId: string) => void;
  updateOption: (fieldId: string, optionId: string, label: string) => void;
  removeOption: (fieldId: string, optionId: string) => void;
}

const FormBuilderContext = createContext<FormBuilderContextValue | null>(null);

interface FormBuilderProviderProps {
  initialData?: FormBuilderData;
  children: ReactNode;
}

export const FormBuilderProvider: FC<FormBuilderProviderProps> = ({
  initialData,
  children,
}) => {
  const value = useFormBuilder(initialData);
  return (
    <FormBuilderContext.Provider value={value}>
      {children}
    </FormBuilderContext.Provider>
  );
};

export function useFormBuilderContext(): FormBuilderContextValue {
  const ctx = useContext(FormBuilderContext);
  if (!ctx) {
    throw new Error(
      'useFormBuilderContext must be used within a FormBuilderProvider',
    );
  }
  return ctx;
}
