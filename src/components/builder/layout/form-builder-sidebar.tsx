'use client';

import { type FC } from 'react';

import { useFormBuilderContext } from '../form-builder-context';
import { FieldEditor, FieldTypePanel } from '../fields';
import type { FormBuilderTab } from './form-builder-tabs';
import { FormConfigCard } from './form-config-card';

interface FormBuilderSidebarProps {
  activeTab: FormBuilderTab;
}

export const FormBuilderSidebar: FC<FormBuilderSidebarProps> = ({
  activeTab,
}) => {
  const { selectedField } = useFormBuilderContext();

  return (
    <div
      className={`space-y-5 lg:col-span-3 ${
        activeTab !== 'fields' ? 'hidden lg:block' : ''
      }`}
    >
      <FormConfigCard />
      <div className="bg-card border-border rounded-xl border p-4">
        <FieldTypePanel />
      </div>
      {selectedField && (
        <div className="bg-card border-border rounded-xl border p-4">
          <FieldEditor />
        </div>
      )}
    </div>
  );
};
