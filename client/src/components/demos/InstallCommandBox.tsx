import { CopyButton } from '@/components/demo/CopyButton';
import { INSTALL_COMMAND } from '@/lib/constants';

interface InstallCommandBoxProps {
  variant?: 'hero' | 'cta';
}

const WRAPPER_CLASSES = {
  hero: 'inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card/50 backdrop-blur-sm',
  cta: 'inline-flex items-center gap-2 px-5 py-4 rounded-xl border border-border bg-card',
};

export const InstallCommandBox = ({
  variant = 'hero',
}: InstallCommandBoxProps) => (
  <div className={WRAPPER_CLASSES[variant]}>
    <code className="font-mono text-sm flex-1 text-left text-foreground">
      {INSTALL_COMMAND}
    </code>
    <CopyButton text={INSTALL_COMMAND} />
  </div>
);
