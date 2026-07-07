import { memo } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export const CopyButton = memo(function CopyButton({ text, className = '' }: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard(text);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={copy}
      className={`${className} transition-transform active:scale-95`}
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
    </Button>
  );
});
