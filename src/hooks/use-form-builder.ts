'use client';

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';

import { FormField } from '@/core/domain/entities/form';
import {
  FieldType,
  FIELD_TYPES,
} from '@/core/domain/value-objects/field-types';

/**
 * Custom hook that encapsulates all form builder logic
 * Manages the state of fields, title, description, and publication status
 */
export function useFormBuilder(initialData?: {
  title: string;
  description: string;
  fields: FormField[];
  published: boolean;
}) {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(
    initialData?.description ?? '',
  );
  const [fields, setFields] = useState<FormField[]>(initialData?.fields ?? []);
  const [published, setPublished] = useState(initialData?.published ?? false);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const selectedField = fields.find((f) => f.id === selectedFieldId) ?? null;

  /** Create a default field of the given type */
  const createField = useCallback((type: FieldType): FormField => {
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
  }, []);

  /** Add a new field */
  const addField = useCallback(
    (type: FieldType) => {
      const newField = createField(type);
      setFields((prev) => [...prev, newField]);
      setSelectedFieldId(newField.id);
    },
    [createField],
  );

  /** Update a field's properties */
  const updateField = useCallback((id: string, updates: Partial<FormField>) => {
    setFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, ...updates } : field)),
    );
  }, []);

  /** Remove a field */
  const removeField = useCallback(
    (id: string) => {
      setFields((prev) => prev.filter((field) => field.id !== id));
      if (selectedFieldId === id) {
        setSelectedFieldId(null);
      }
    },
    [selectedFieldId],
  );

  /** Duplicate a field */
  const duplicateField = useCallback((id: string) => {
    setFields((prev) => {
      const index = prev.findIndex((f) => f.id === id);
      if (index === -1) return prev;
      const original = prev[index];
      const duplicated: FormField = {
        ...structuredClone(original),
        id: uuidv4(),
        label: `${original.label} (copia)`,
        options: original.options?.map((o) => ({ ...o, id: uuidv4() })),
      };
      const next = [...prev];
      next.splice(index + 1, 0, duplicated);
      return next;
    });
  }, []);

  /** Reorder fields after drag & drop */
  const reorderFields = useCallback((activeId: string, overId: string) => {
    setFields((prev) => {
      const oldIndex = prev.findIndex((f) => f.id === activeId);
      const newIndex = prev.findIndex((f) => f.id === overId);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  }, []);

  /** Add option to a select field */
  const addOption = useCallback((fieldId: string) => {
    setFields((prev) =>
      prev.map((field) => {
        if (field.id !== fieldId) return field;
        const options = field.options ?? [];
        return {
          ...field,
          options: [
            ...options,
            { id: uuidv4(), label: `Opción ${options.length + 1}` },
          ],
        };
      }),
    );
  }, []);

  /** Update an option */
  const updateOption = useCallback(
    (fieldId: string, optionId: string, label: string) => {
      setFields((prev) =>
        prev.map((field) => {
          if (field.id !== fieldId) return field;
          return {
            ...field,
            options: field.options?.map((o) =>
              o.id === optionId ? { ...o, label } : o,
            ),
          };
        }),
      );
    },
    [],
  );

  /** Remove an option */
  const removeOption = useCallback((fieldId: string, optionId: string) => {
    setFields((prev) =>
      prev.map((field) => {
        if (field.id !== fieldId) return field;
        return {
          ...field,
          options: field.options?.filter((o) => o.id !== optionId),
        };
      }),
    );
  }, []);

  return {
    // State
    title,
    description,
    fields,
    published,
    selectedFieldId,
    selectedField,

    // Setters
    setTitle,
    setDescription,
    setPublished,
    setSelectedFieldId,

    // Field operations
    addField,
    updateField,
    removeField,
    duplicateField,
    reorderFields,

    // Option operations
    addOption,
    updateOption,
    removeOption,
  };
}
