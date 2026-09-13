'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface QAInputProps {
  onSend: (question: string) => void;
  disabled?: boolean;
}

export function QAInput({ onSend, disabled }: QAInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-space-xs">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask about this bill…"
        disabled={disabled}
        className="flex-1"
      />
      <Button
        type="submit"
        size="icon"
        disabled={disabled || !value.trim()}
        aria-label="Send"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
