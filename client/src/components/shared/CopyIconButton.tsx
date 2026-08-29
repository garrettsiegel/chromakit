import { memo } from 'react';
import { Copy, Check } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

interface CopyIconButtonProps {
  text: string;
  className?: string;
}

const BASE_CLASSES = 'copy-icon-button';

export const CopyIconButton = memo(function CopyIconButton({
  text,
  className = '',
}: CopyIconButtonProps) {
  const { copied, copy } = useCopyToClipboard(text);

  return (
    <button
      type="button"
      onClick={copy}
      className={`${BASE_CLASSES} ${className}`}
      data-testid="button-copy"
      aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
      aria-live="polite"
    >
      {copied ? (
        <Check className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Copy className="h-4 w-4" aria-hidden="true" />
      )}
      <span className="sr-only">
        {copied ? 'Copied!' : 'Copy to clipboard'}
      </span>
    </button>
  );
});
