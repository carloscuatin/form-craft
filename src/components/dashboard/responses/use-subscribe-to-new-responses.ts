'use client';

import { useEffect, useMemo, useRef } from 'react';

import type { FormResponse } from '@/core/domain/entities/response';
import { createSubscribeToNewResponsesUseCase } from '@/infrastructure/browser-container';

/**
 * Subscribes to new responses for a form via Realtime (clean architecture: use case + port).
 * Calls onNewResponse when a new response is inserted; cleanup unsubscribes.
 * You can pass the callback inline — the hook keeps the latest reference and does not re-subscribe on every render.
 */
export const useSubscribeToNewResponses = (
  formId: string,
  onNewResponse: (response: FormResponse) => void,
): void => {
  const onNewResponseRef = useRef(onNewResponse);

  const subscribeToNewResponses = useMemo(
    () => createSubscribeToNewResponsesUseCase(),
    [],
  );

  useEffect(() => {
    onNewResponseRef.current = onNewResponse;
  }, [onNewResponse]);

  useEffect(() => {
    const unsubscribe = subscribeToNewResponses.execute(formId, (response) => {
      onNewResponseRef.current(response);
    });
    return unsubscribe;
  }, [formId, subscribeToNewResponses]);
};
