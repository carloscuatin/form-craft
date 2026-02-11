'use client';

import { type FC } from 'react';
import { Eye, Layers } from 'lucide-react';

export type FormBuilderTab = 'fields' | 'preview';

interface FormBuilderTabsProps {
  activeTab: FormBuilderTab;
  onTabChange: (tab: FormBuilderTab) => void;
}

export const FormBuilderTabs: FC<FormBuilderTabsProps> = ({
  activeTab,
  onTabChange,
}) => (
  <div className="border-border bg-background flex border-b lg:hidden">
    <button
      type="button"
      onClick={() => onTabChange('fields')}
      className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
        activeTab === 'fields'
          ? 'border-b-2 border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
          : 'text-muted-foreground'
      }`}
    >
      <Layers className="mr-1.5 inline-block h-4 w-4" />
      Campos
    </button>
    <button
      type="button"
      onClick={() => onTabChange('preview')}
      className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
        activeTab === 'preview'
          ? 'border-b-2 border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
          : 'text-muted-foreground'
      }`}
    >
      <Eye className="mr-1.5 inline-block h-4 w-4" />
      Vista previa
    </button>
  </div>
);
