/**
 * Supabase Form Repository
 * Adapter that implements the FormRepository port using Supabase
 */

import { SupabaseClient } from '@supabase/supabase-js';

import {
  FormRepository,
  CreateFormDTO,
  UpdateFormDTO,
} from '@/core/domain/ports/form-repository';
import { Form, FormWithResponseCount } from '@/core/domain/entities/form';
import {
  FormMapper,
  FormRow,
  FormRowWithCount,
} from '@/infrastructure/mappers/form-mapper';

export class SupabaseFormRepository implements FormRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async create(dto: CreateFormDTO): Promise<Form> {
    const { data, error } = await this.supabase
      .from('forms')
      .insert({
        user_id: dto.userId,
        title: dto.title,
        description: dto.description,
        fields: dto.fields,
        published: dto.published ?? false,
      })
      .select()
      .single();

    if (error) throw new Error(`Error creando formulario: ${error.message}`);
    return FormMapper.toDomain(data as FormRow);
  }

  async findById(id: string): Promise<Form | null> {
    const { data, error } = await this.supabase
      .from('forms')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error buscando formulario: ${error.message}`);
    }
    return FormMapper.toDomain(data as FormRow);
  }

  async findPublishedById(id: string): Promise<Form | null> {
    const { data, error } = await this.supabase
      .from('forms')
      .select('*')
      .eq('id', id)
      .eq('published', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error buscando formulario público: ${error.message}`);
    }
    return FormMapper.toDomain(data as FormRow);
  }

  async findAllByUserId(userId: string): Promise<FormWithResponseCount[]> {
    const { data, error } = await this.supabase.rpc(
      'get_form_with_response_count',
      { p_user_id: userId },
    );

    if (error) throw new Error(`Error listando formularios: ${error.message}`);
    return (data as FormRowWithCount[]).map(FormMapper.toDomainWithCount);
  }

  async update(id: string, dto: UpdateFormDTO): Promise<Form> {
    const updateData = FormMapper.toPersistence(dto as Partial<Form>);

    const { data, error } = await this.supabase
      .from('forms')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error)
      throw new Error(`Error actualizando formulario: ${error.message}`);
    return FormMapper.toDomain(data as FormRow);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from('forms').delete().eq('id', id);

    if (error) throw new Error(`Error eliminando formulario: ${error.message}`);
  }
}
