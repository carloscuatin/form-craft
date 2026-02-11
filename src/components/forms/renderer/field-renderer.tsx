'use client';

import { type FC } from 'react';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormField } from '@/core/domain/entities/form';
import { FIELD_TYPES } from '@/core/domain/value-objects/field-types';
import { AnswerValue } from '@/core/domain/entities/response';

interface FieldRendererProps {
  field: FormField;
  value?: AnswerValue;
  onChange?: (value: AnswerValue) => void;
  error?: string;
  disabled?: boolean;
}

/**
 * Renders a single form field dynamically based on its type
 * Used in both the preview panel and the public form
 */
export const FieldRenderer: FC<FieldRendererProps> = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const handleChange = (newValue: AnswerValue) => {
    onChange?.(newValue);
  };

  const renderInput = () => {
    switch (field.type) {
      case FIELD_TYPES.SHORT_TEXT:
        return (
          <Input
            type="text"
            placeholder={field.placeholder || ''}
            value={(value as string) ?? ''}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            className="h-10"
          />
        );

      case FIELD_TYPES.LONG_TEXT:
        return (
          <Textarea
            placeholder={field.placeholder || ''}
            value={(value as string) ?? ''}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            rows={4}
          />
        );

      case FIELD_TYPES.NUMBER:
        return (
          <Input
            type="number"
            placeholder={field.placeholder || ''}
            value={value !== null && value !== undefined ? String(value) : ''}
            onChange={(e) =>
              handleChange(
                e.target.value === '' ? null : Number(e.target.value),
              )
            }
            disabled={disabled}
            className="h-10"
          />
        );

      case FIELD_TYPES.DATE:
        return (
          <Input
            type="date"
            value={(value as string) ?? ''}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            className="h-10"
          />
        );

      case FIELD_TYPES.SINGLE_SELECT:
        return (
          <Select
            value={(value as string) ?? ''}
            onValueChange={(v) => handleChange(v)}
            disabled={disabled}
          >
            <SelectTrigger className="h-10">
              <SelectValue
                placeholder={field.placeholder || 'Selecciona una opción'}
              />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case FIELD_TYPES.MULTI_SELECT:
        return (
          <div className="space-y-2">
            {field.options?.map((option) => {
              const selected = Array.isArray(value)
                ? value.includes(option.id)
                : false;
              return (
                <div key={option.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`${field.id}-${option.id}`}
                    checked={selected}
                    disabled={disabled}
                    onCheckedChange={(checked) => {
                      const currentArr = Array.isArray(value) ? [...value] : [];
                      if (checked) {
                        handleChange([...currentArr, option.id]);
                      } else {
                        handleChange(currentArr.filter((v) => v !== option.id));
                      }
                    }}
                  />
                  <Label
                    htmlFor={`${field.id}-${option.id}`}
                    className="text-foreground cursor-pointer text-sm"
                  >
                    {option.label}
                  </Label>
                </div>
              );
            })}
          </div>
        );

      default:
        return (
          <p className="text-muted-foreground text-sm">
            Tipo de campo no soportado
          </p>
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-foreground text-sm font-medium">
        {field.label || 'Campo sin nombre'}
        {field.required && <span className="ml-1 text-red-500">*</span>}
      </Label>
      {renderInput()}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
