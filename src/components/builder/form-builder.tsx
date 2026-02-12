'use client';

import { type FC, useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';

import { FormField } from '@/core/domain/entities/form';

import { FormBuilderProvider } from './form-builder-context';
import { useFormBuilderDnD } from './hooks';
import {
  FormBuilderHeader,
  FormBuilderTabs,
  FormBuilderSidebar,
  FormBuilderFieldsColumn,
  type FormBuilderTab,
} from './layout';
import { FormBuilderDragOverlay } from './fields';
import { FormPreview } from './preview';

export interface FormBuilderProps {
  formId?: string;
  initialData?: {
    title: string;
    description: string;
    fields: FormField[];
    published: boolean;
  };
}

const FormBuilderInner: FC<{ formId?: string }> = ({ formId }) => {
  const [activeTab, setActiveTab] = useState<FormBuilderTab>('fields');

  const {
    sensors,
    collisionDetection,
    onDragStart,
    onDragOver,
    onDragEnd,
    onDragCancel,
    activeDragType,
    activeField,
    isDropTarget,
    dragWidth,
    insertionIndex,
  } = useFormBuilderDnD();

  return (
    <div className="from-background via-background min-h-screen bg-linear-to-br to-indigo-50/30 dark:to-indigo-950/20">
      <FormBuilderHeader formId={formId} />
      <FormBuilderTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
      >
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <FormBuilderSidebar activeTab={activeTab} />
            <FormBuilderFieldsColumn
              activeTab={activeTab}
              isDropTarget={isDropTarget}
              insertionIndex={insertionIndex}
            />
            <div
              className={`lg:col-span-4 ${
                activeTab !== 'preview' ? 'hidden lg:block' : ''
              }`}
            >
              <FormPreview />
            </div>
          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          <FormBuilderDragOverlay
            activeDragType={activeDragType}
            activeField={activeField}
            dragWidth={dragWidth}
          />
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export const FormBuilder: FC<FormBuilderProps> = ({ formId, initialData }) => (
  <FormBuilderProvider initialData={initialData}>
    <FormBuilderInner formId={formId} />
  </FormBuilderProvider>
);
