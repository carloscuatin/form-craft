'use client';

import { type FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { toast } from 'sonner';
import { Loader2, Save, ArrowLeft, Eye, Layers, Settings2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useFormBuilder } from '@/hooks/use-form-builder';
import { createForm, updateForm } from '@/app/actions/forms';
import { FormField } from '@/core/domain/entities/form';

import { FieldTypePanel } from './field-type-panel';
import { SortableFieldItem } from './sortable-field-item';
import { FieldEditor } from './field-editor';
import { FormPreview } from './form-preview';

interface FormBuilderProps {
  formId?: string;
  initialData?: {
    title: string;
    description: string;
    fields: FormField[];
    published: boolean;
  };
}

type ActiveTab = 'fields' | 'preview';

export const FormBuilder: FC<FormBuilderProps> = ({ formId, initialData }) => {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('fields');

  const builder = useFormBuilder(initialData);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      builder.reorderFields(active.id as string, over.id as string);
    }
  }

  async function handleSave() {
    if (!builder.title.trim()) {
      toast.error('El título es obligatorio');
      return;
    }

    setSaving(true);
    try {
      if (formId) {
        const result = await updateForm(formId, {
          title: builder.title,
          description: builder.description,
          fields: builder.fields,
          published: builder.published,
        });
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success('Formulario guardado');
        }
      } else {
        const result = await createForm({
          title: builder.title,
          description: builder.description,
          fields: builder.fields,
          published: builder.published,
        });
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success('Formulario creado');
          router.push(`/builder/${result.data!.id}`);
        }
      }
    } catch {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="from-background via-background min-h-screen bg-linear-to-br to-indigo-50/30 dark:to-indigo-950/20">
      {/* Header */}
      <header className="border-border bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <span className="text-foreground max-w-[200px] truncate text-sm font-semibold">
              {builder.title || 'Nuevo formulario'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-muted-foreground hidden text-xs sm:block">
                Publicado
              </label>
              <button
                onClick={() => builder.setPublished(!builder.published)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
                  builder.published ? 'bg-indigo-600' : 'bg-muted'
                }`}
              >
                <span
                  className={`dark:bg-foreground pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition-transform ${
                    builder.published ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              size="sm"
              className="bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-sm hover:from-indigo-700 hover:to-violet-700"
            >
              {saving ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-1.5 h-4 w-4" />
              )}
              Guardar
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile tabs */}
      <div className="border-border bg-background flex border-b lg:hidden">
        <button
          onClick={() => setActiveTab('fields')}
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
          onClick={() => setActiveTab('preview')}
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

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left sidebar - Field types & editor */}
          <div
            className={`space-y-5 lg:col-span-3 ${
              activeTab !== 'fields' ? 'hidden lg:block' : ''
            }`}
          >
            {/* Form info */}
            <div className="bg-card border-border space-y-3 rounded-xl border p-4">
              <div className="text-muted-foreground mb-2 flex items-center gap-2 text-xs font-medium tracking-wider uppercase">
                <Settings2 className="h-3.5 w-3.5" />
                Configuración
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="form-title"
                  className="text-muted-foreground text-xs"
                >
                  Título
                </Label>
                <Input
                  id="form-title"
                  value={builder.title}
                  onChange={(e) => builder.setTitle(e.target.value)}
                  placeholder="Título del formulario"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="form-desc"
                  className="text-muted-foreground text-xs"
                >
                  Descripción
                </Label>
                <Textarea
                  id="form-desc"
                  value={builder.description}
                  onChange={(e) => builder.setDescription(e.target.value)}
                  placeholder="Describe el propósito del formulario"
                  rows={2}
                  className="resize-none text-sm"
                />
              </div>
            </div>

            <div className="bg-card border-border rounded-xl border p-4">
              <FieldTypePanel onAddField={builder.addField} />
            </div>

            {/* Field editor (when a field is selected) */}
            {builder.selectedField && (
              <div className="bg-card border-border rounded-xl border p-4">
                <FieldEditor
                  field={builder.selectedField}
                  onUpdate={(updates) =>
                    builder.updateField(builder.selectedFieldId!, updates)
                  }
                  onAddOption={() =>
                    builder.addOption(builder.selectedFieldId!)
                  }
                  onUpdateOption={(optionId, label) =>
                    builder.updateOption(
                      builder.selectedFieldId!,
                      optionId,
                      label,
                    )
                  }
                  onRemoveOption={(optionId) =>
                    builder.removeOption(builder.selectedFieldId!, optionId)
                  }
                />
              </div>
            )}
          </div>

          {/* Center - Fields list */}
          <div
            className={`lg:col-span-5 ${
              activeTab !== 'fields' ? 'hidden lg:block' : ''
            }`}
          >
            <div className="space-y-3">
              <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wider uppercase">
                <Layers className="h-3.5 w-3.5" />
                Campos del formulario ({builder.fields.length})
              </div>

              {builder.fields.length === 0 ? (
                <div className="border-border bg-card/50 rounded-xl border-2 border-dashed py-16 text-center">
                  <Layers className="text-muted-foreground/40 mx-auto mb-3 h-8 w-8" />
                  <p className="text-muted-foreground text-sm">
                    Agrega campos desde el panel lateral
                  </p>
                  <p className="text-muted-foreground/60 mt-1 text-xs">
                    o arrástralos para reordenar
                  </p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={builder.fields.map((f) => f.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {builder.fields.map((field) => (
                        <SortableFieldItem
                          key={field.id}
                          field={field}
                          isSelected={builder.selectedFieldId === field.id}
                          onSelect={() => builder.setSelectedFieldId(field.id)}
                          onRemove={() => builder.removeField(field.id)}
                          onDuplicate={() => builder.duplicateField(field.id)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>

          {/* Right - Preview */}
          <div
            className={`lg:col-span-4 ${
              activeTab !== 'preview' ? 'hidden lg:block' : ''
            }`}
          >
            <FormPreview
              title={builder.title}
              description={builder.description}
              fields={builder.fields}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
