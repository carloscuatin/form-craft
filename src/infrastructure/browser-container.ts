/**
 * Browser Container
 * Composition root for client-side use cases (Realtime, etc.).
 * Wires ports with adapters; only this layer depends on infrastructure.
 */

import { SubscribeToNewResponsesUseCase } from '@/core/use-cases/subscribe-to-new-responses';

import { SupabaseResponseRepository } from './adapters/supabase/supabase-response-repository';
import { createBrowserSupabaseClient } from './adapters/supabase/client';

/** Create the subscribe-to-new-responses use case (browser Supabase Realtime). */
export function createSubscribeToNewResponsesUseCase(): SubscribeToNewResponsesUseCase {
  const supabase = createBrowserSupabaseClient();
  const responseRepo = new SupabaseResponseRepository(supabase);
  return new SubscribeToNewResponsesUseCase(responseRepo);
}
