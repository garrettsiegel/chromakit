import { useState, useCallback } from 'react';
import { copyToClipboard } from '../utils';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  onCopy?: (success: boolean) => void;
}

export function CopyButton({
  text,
  label = 'Copy',
  className = '',
  onCopy,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(text);
    setCopied(success);
    onCopy?.(success);

    if (success) {
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text, onCopy]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`ck-copy-btn ${copied ? 'ck-copy-btn--copied' : ''} ${className}`}
      aria-label={copied ? 'Copied!' : label}
      title={copied ? 'Copied!' : label}
    >
      {copied ? (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}
