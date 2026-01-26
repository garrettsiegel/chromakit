import { type ReactNode } from 'react';

// ============================================================
// TYPES
// ============================================================

interface SectionWrapperProps {
  children: ReactNode;
  id?: string;
  variant?: 'default' | 'gradient-orbs' | 'glassmorphic' | 'minimal';
  className?: string;
  containerClassName?: string;
  showDivider?: boolean;
}

// ============================================================
// COMPONENT
// ============================================================

export function SectionWrapper({
  children,
  id,
  variant = 'default',
  className = '',
  containerClassName = '',
  showDivider = false,
}: SectionWrapperProps) {
  const variantClasses = {
    default: '',
    'gradient-orbs': 'relative overflow-hidden',
    glassmorphic: 'relative overflow-hidden',
    minimal: '',
  };

  return (
    <>
      {showDivider && (
        <div className="relative w-full h-px my-20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/20 blur-sm" />
        </div>
      )}

      <section
        id={id}
        className={`relative py-20 md:py-32 ${variantClasses[variant]} ${className}`}
      >
        {/* GRADIENT ORBS BACKGROUND */}
        {variant === 'gradient-orbs' && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl animate-float noise-texture"
              style={{
                background:
                  'radial-gradient(circle, hsl(18, 98%, 60%) 0%, transparent 70%)',
                animationDuration: '25s',
              }}
            />
            <div
              className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-15 blur-3xl animate-float-delayed noise-texture"
              style={{
                background:
                  'radial-gradient(circle, hsl(250, 85%, 65%) 0%, transparent 70%)',
                animationDuration: '30s',
                animationDelay: '5s',
              }}
            />
          </div>
        )}

        {/* GLASSMORPHIC BACKGROUND */}
        {variant === 'glassmorphic' && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-violet-500/5" />
            <div
              className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full opacity-30 blur-3xl animate-float"
              style={{
                background:
                  'radial-gradient(circle, hsl(18, 98%, 60%) 0%, transparent 60%)',
                animationDuration: '20s',
              }}
            />
            <div
              className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full opacity-20 blur-3xl animate-float-delayed"
              style={{
                background:
                  'radial-gradient(circle, hsl(270, 85%, 65%) 0%, transparent 60%)',
                animationDuration: '25s',
                animationDelay: '3s',
              }}
            />
          </div>
        )}

        {/* CONTENT CONTAINER */}
        <div className={`container mx-auto px-6 relative z-10 ${containerClassName}`}>
          {children}
        </div>
      </section>
    </>
  );
}
