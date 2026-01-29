import { Palette, Zap, Code2 } from 'lucide-react';

// ============================================================
// TYPES
// ============================================================

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// ============================================================
// MAIN FEATURES SECTION
// ============================================================

export function FeaturesSection() {
  const features: Feature[] = [
    {
      icon: <Palette className="w-6 h-6" />,
      title: 'OKLCH Color Space',
      description:
        'Perceptually uniform colors that match human vision. Create smooth gradients without muddy middle tones.',
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      title: 'Composable Components',
      description:
        'Build custom pickers with ColorArea, HueSlider, and more. Complete control over your design.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Performance First',
      description:
        '60 FPS interactions with optimized React 19 hooks. Zero dependencies. Built for production.',
    },
  ];

  return (
    <section className="relative py-16 md:py-24">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="space-y-4 text-center">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                  {feature.icon}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
