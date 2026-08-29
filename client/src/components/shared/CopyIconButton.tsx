import { memo } from 'react';
import { Copy, Check } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

interface CopyIconButtonProps {
  text: string;
  className?: string;
}

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap h-9 w-9 rounded-md border border-transparent text-sm font-medium hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';

export const CopyIconButton = memo(function CopyIconButton({
  text,
  className = '',
}: CopyIconButtonProps) {
  const { copied, copy } = useCopyToClipboard(text);

  return (
    <button
      type="button"
      onClick={copy}
      className={`${BASE_CLASSES} ${className} transition-transform active:scale-95`}
      data-testid="button-copy"
      aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      <span className="sr-only">
        {copied ? 'Copied!' : 'Copy to clipboard'}
      </span>
    </button>
  );
});
