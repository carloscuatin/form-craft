'use client';

import { type FC, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

interface CopyLinkButtonProps {
  formId: string;
}

export const CopyLinkButton: FC<CopyLinkButtonProps> = ({ formId }) => {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const url = `${window.location.origin}/forms/${formId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copiado al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      {copied ? (
        <Check className="mr-1.5 h-4 w-4 text-emerald-500" />
      ) : (
        <Copy className="mr-1.5 h-4 w-4" />
      )}
      {copied ? 'Copiado' : 'Copiar link'}
    </Button>
  );
};
