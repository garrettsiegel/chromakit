import { useCallback, useEffect, useRef, useState } from 'react';
import { copyToClipboard } from '@/lib/color-picker';

const RESET_MS = 2000;

export const useCopyToClipboard = (text: string) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(async () => {
    if (!(await copyToClipboard(text))) return;
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), RESET_MS);
  }, [text]);

  return { copied, copy };
};
