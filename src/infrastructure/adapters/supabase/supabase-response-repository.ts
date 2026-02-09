/**
 * Supabase Response Repository
 * Adapter that implements the ResponseRepository port using Supabase
 */

import { SupabaseClient } from '@supabase/supabase-js';

import {
  ResponseRepository,
  SubmitResponseDTO,
} from '@/core/domain/ports/response-repository';
import { FormResponse } from '@/core/domain/entities/response';
import {
  ResponseMapper,
  ResponseRow,
} from '@/infrastructure/mappers/response-mapper';

export class SupabaseResponseRepository implements ResponseRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async create(dto: SubmitResponseDTO): Promise<void> {
    const { error } = await this.supabase
      .from('responses')
      .insert(ResponseMapper.toPersistence(dto));

    if (error) throw new Error(`Error enviando respuesta: ${error.message}`);
  }

  async findByFormId(formId: string): Promise<FormResponse[]> {
    const { data, error } = await this.supabase
      .from('responses')
      .select('*')
      .eq('form_id', formId)
      .order('submitted_at', { ascending: false });

    if (error) throw new Error(`Error obteniendo respuestas: ${error.message}`);
    return (data as ResponseRow[]).map(ResponseMapper.toDomain);
  }

  async countByFormId(formId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('responses')
      .select('*', { count: 'exact', head: true })
      .eq('form_id', formId);

    if (error) throw new Error(`Error contando respuestas: ${error.message}`);
    return count ?? 0;
  }
}
