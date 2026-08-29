import { CopyIconButton } from '@/components/shared/CopyIconButton';

const INSTALL_COMMAND = 'npm install chromakit-react';

interface InstallCommandBoxProps {
  variant?: 'hero' | 'cta';
}

const WRAPPER_CLASSES = {
  hero: 'install-command install-command--hero',
  cta: 'install-command install-command--cta',
};

export const InstallCommandBox = ({
  variant = 'hero',
}: InstallCommandBoxProps) => (
  <div className={WRAPPER_CLASSES[variant]}>
    <code>{INSTALL_COMMAND}</code>
    <CopyIconButton text={INSTALL_COMMAND} />
  </div>
);
