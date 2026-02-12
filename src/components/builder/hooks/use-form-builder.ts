'use client';

import { useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';

import { FormField } from '@/core/domain/entities/form';
import {
  FieldType,
  FIELD_TYPES,
} from '@/core/domain/value-objects/field-types';

import {
  formBuilderSchema,
  type FormBuilderData,
} from '../form-builder-schema';

/**
 * Custom hook that encapsulates all form builder logic.
 * Manages the state and validation of the form builder.
 */
export const useFormBuilder = (initialData?: FormBuilderData) => {
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const form = useForm<FormBuilderData>({
    resolver: zodResolver(formBuilderSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      fields: initialData?.fields ?? [],
      published: initialData?.published ?? false,
    },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'fields',
  });

  const fields = useWatch({ control: form.control, name: 'fields' });
  const selectedField = fields.find((f) => f.id === selectedFieldId) ?? null;

  /** Create a default field of the given type */
  const createDefaultField = (type: FieldType): FormField => {
    const base: FormField = {
      id: uuidv4(),
      type,
      label: '',
      placeholder: '',
      required: false,
    };

    if (
      type === FIELD_TYPES.SINGLE_SELECT ||
      type === FIELD_TYPES.MULTI_SELECT
    ) {
      base.options = [
        { id: uuidv4(), label: 'Opción 1' },
        { id: uuidv4(), label: 'Opción 2' },
      ];
    }

    return base;
  };

  /** Add a new field at the end */
  const addField = (type: FieldType) => {
    const newField = createDefaultField(type);
    fieldArray.append(newField);
    setSelectedFieldId(newField.id);
  };

  /** Add a new field at a specific index */
  const addFieldAt = (type: FieldType, index: number) => {
    const newField = createDefaultField(type);
    fieldArray.insert(index, newField);
    setSelectedFieldId(newField.id);
  };

  /** Update a field's properties */
  const updateField = (id: string, updates: Partial<FormField>) => {
    const index = fields.findIndex((f) => f.id === id);
    if (index === -1) return;
    fieldArray.update(index, { ...fields[index], ...updates });
  };

  /** Remove a field */
  const removeField = (id: string) => {
    const index = fields.findIndex((f) => f.id === id);
    if (index === -1) return;
    fieldArray.remove(index);
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  /** Duplicate a field */
  const duplicateField = (id: string) => {
    const index = fields.findIndex((f) => f.id === id);
    if (index === -1) return;
    const original = fields[index];
    const duplicated: FormField = {
      ...structuredClone(original),
      id: uuidv4(),
      label: `${original.label} (copia)`,
      options: original.options?.map((o) => ({ ...o, id: uuidv4() })),
    };
    fieldArray.insert(index + 1, duplicated);
  };

  /** Reorder fields after drag & drop */
  const reorderFields = (activeId: string, overId: string) => {
    const oldIndex = fields.findIndex((f) => f.id === activeId);
    const overIndex = fields.findIndex((f) => f.id === overId);
    if (oldIndex === -1 || overIndex === -1) return;
    fieldArray.move(oldIndex, overIndex);
  };

  /** Add option to a select field */
  const addOption = (fieldId: string) => {
    const index = fields.findIndex((f) => f.id === fieldId);
    if (index === -1) return;
    const field = fields[index];
    const options = field.options ?? [];
    fieldArray.update(index, {
      ...field,
      options: [
        ...options,
        { id: uuidv4(), label: `Opción ${options.length + 1}` },
      ],
    });
  };

  /** Update an option */
  const updateOption = (fieldId: string, optionId: string, label: string) => {
    const index = fields.findIndex((f) => f.id === fieldId);
    if (index === -1) return;
    const field = fields[index];
    fieldArray.update(index, {
      ...field,
      options: field.options?.map((o) =>
        o.id === optionId ? { ...o, label } : o,
      ),
    });
  };

  /** Remove an option */
  const removeOption = (fieldId: string, optionId: string) => {
    const index = fields.findIndex((f) => f.id === fieldId);
    if (index === -1) return;
    const field = fields[index];
    fieldArray.update(index, {
      ...field,
      options: field.options?.filter((o) => o.id !== optionId),
    });
  };

  return {
    form,
    fields,
    selectedFieldId,
    selectedField,
    setSelectedFieldId,
    addField,
    addFieldAt,
    updateField,
    removeField,
    duplicateField,
    reorderFields,
    addOption,
    updateOption,
    removeOption,
  };
};
