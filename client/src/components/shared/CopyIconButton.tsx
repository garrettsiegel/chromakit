import { Copy, Check } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export const CopyIconButton = ({ text }: { text: string }) => {
  const { copied, copy } = useCopyToClipboard(text);
  const Icon = copied ? Check : Copy;

  return (
    <button
      type="button"
      className="copy-icon-button"
      onClick={copy}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      <Icon size={16} aria-hidden="true" />
    </button>
  );
};
