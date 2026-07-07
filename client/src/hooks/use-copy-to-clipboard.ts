import { useState, useCallback } from 'react';

/**
 * Copies `text` to the clipboard and reports a "copied" state for 2s.
 * Shared by the demo's various copy-to-clipboard buttons.
 */
export function useCopyToClipboard(text: string) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return { copied, copy };
}
