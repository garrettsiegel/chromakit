import { Palette, Code2, Zap, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';

// ============================================================
// TYPES
// ============================================================

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

// ============================================================
// FEATURE CARD COMPONENT
// ============================================================

function FeatureCard({ icon, title, description, gradient }: Feature) {
  return (
    <Card className="relative p-8 space-y-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group overflow-hidden">
      {/* GRADIENT BACKGROUND */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${gradient}`}
      />

      {/* ICON */}
      <div className={`w-12 h-12 rounded-xl ${gradient} p-3 relative z-10`}>{icon}</div>

      {/* CONTENT */}
      <div className="relative z-10 space-y-2">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </Card>
  );
}

// ============================================================
// MAIN FEATURES SECTION
// ============================================================

export function FeaturesSection() {
  const features: Feature[] = [
    {
      icon: <Palette className="w-full h-full text-orange-500" />,
      title: 'OKLCH Color Space',
      description:
        'Perceptually uniform colors that match human vision. Create smooth gradients without muddy middle tones—impossible with RGB.',
      gradient: 'bg-gradient-to-br from-orange-500/10 to-amber-500/10',
    },
    {
      icon: <Code2 className="w-full h-full text-blue-500" />,
      title: 'Composable Primitives',
      description:
        'Build custom pickers with ColorArea, HueSlider, AlphaSlider, and more. Complete control over layout and styling.',
      gradient: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10',
    },
    {
      icon: <Zap className="w-full h-full text-yellow-500" />,
      title: 'Performance First',
      description:
        '60 FPS interactions with <3ms re-renders. Optimized React 19 hooks with zero memory leaks. Built for production.',
      gradient: 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10',
    },
    {
      icon: <Shield className="w-full h-full text-green-500" />,
      title: 'Accessible by Default',
      description:
        'WCAG AA compliant with full keyboard navigation, screen reader support, and focus management. Built-in dark mode.',
      gradient: 'bg-gradient-to-br from-green-500/10 to-emerald-500/10',
    },
  ];

  return (
    <section id="features" className="relative py-20 md:py-32">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* HEADING */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete color picker solution designed for modern React applications
            </p>
          </div>

          {/* FEATURES GRID */}
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <FeatureCard key={i} {...feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
