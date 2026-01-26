import { useState } from 'react';
import { Zap, Package, Code2, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ColorPicker } from '@/lib/color-picker';
import { Badge } from '@/components/ui/badge';

// ============================================================
// TYPES
// ============================================================

interface MetricCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}

// ============================================================
// METRIC CARD COMPONENT
// ============================================================

function MetricCard({ icon, value, label, color }: MetricCardProps) {
  return (
    <div className="flex items-start gap-4 p-6 rounded-xl bg-muted/50 border border-border">
      <div
        className={`p-3 rounded-lg ${color}`}
        style={{ boxShadow: '0 0 20px -5px currentColor' }}
      >
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

// ============================================================
// COMPARISON TABLE COMPONENT
// ============================================================

function ComparisonTable() {
  const comparisons = [
    {
      feature: 'OKLCH/OKLAB Support',
      chromakit: true,
      reactColorful: false,
      reactColor: false,
    },
    {
      feature: 'Bundle Size',
      chromakit: '10KB',
      reactColorful: '3KB',
      reactColor: '28KB',
    },
    {
      feature: 'TypeScript Native',
      chromakit: true,
      reactColorful: true,
      reactColor: 'Partial',
    },
    {
      feature: 'Composable Components',
      chromakit: true,
      reactColorful: 'Limited',
      reactColor: false,
    },
    {
      feature: 'Built-in Dark Mode',
      chromakit: true,
      reactColorful: false,
      reactColor: false,
    },
    {
      feature: 'Zero Dependencies',
      chromakit: true,
      reactColorful: true,
      reactColor: true,
    },
  ];

  const renderCell = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <span className="text-green-500 font-medium">✓</span>
      ) : (
        <span className="text-red-500 font-medium">✗</span>
      );
    }
    return <span className="text-sm font-medium">{value}</span>;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-4 px-4 text-sm font-semibold">
              Feature
            </th>
            <th className="text-center py-4 px-4 text-sm font-semibold">
              <div className="flex items-center justify-center gap-2">
                ChromaKit
                <Badge variant="default" className="text-xs">
                  New
                </Badge>
              </div>
            </th>
            <th className="text-center py-4 px-4 text-sm font-semibold text-muted-foreground">
              react-colorful
            </th>
            <th className="text-center py-4 px-4 text-sm font-semibold text-muted-foreground">
              react-color
            </th>
          </tr>
        </thead>
        <tbody>
          {comparisons.map((row, i) => (
            <tr
              key={i}
              className="border-b border-border hover:bg-muted/30 transition-colors"
            >
              <td className="py-4 px-4 text-sm">{row.feature}</td>
              <td className="py-4 px-4 text-center bg-primary/5">
                {renderCell(row.chromakit)}
              </td>
              <td className="py-4 px-4 text-center">
                {renderCell(row.reactColorful)}
              </td>
              <td className="py-4 px-4 text-center">
                {renderCell(row.reactColor)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// LIVE PICKER COMPARISON COMPONENT
// ============================================================

function LivePickerComparison() {
  const [chromakitColor, setChromakitColor] = useState('#ff6b35');
  const [competitorColor, setCompetitorColor] = useState('#ff6b35');

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* CHROMAKIT PICKER */}
      <Card className="p-6 space-y-4 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">ChromaKit (OKLCH)</h3>
          <Badge variant="default">Smooth</Badge>
        </div>
        <div className="flex justify-center">
          <ColorPicker
            value={chromakitColor}
            onChange={(color) => setChromakitColor(color.hex)}
          />
        </div>
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Current Color:</div>
          <div className="font-mono text-sm bg-muted/50 px-3 py-2 rounded">
            {chromakitColor}
          </div>
        </div>
      </Card>

      {/* COMPETITOR PICKER */}
      <Card className="p-6 space-y-4 opacity-60">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Legacy (RGB)</h3>
          <Badge variant="outline">Muddy</Badge>
        </div>
        <div className="flex justify-center">
          <ColorPicker
            value={competitorColor}
            onChange={(color) => setCompetitorColor(color.hex)}
          />
        </div>
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Current Color:</div>
          <div className="font-mono text-sm bg-muted/50 px-3 py-2 rounded">
            {competitorColor}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// MAIN COMPARISON COMPONENT
// ============================================================

export function InteractiveComparison() {
  return (
    <section
      id="comparison"
      className="relative py-20 md:py-32 overflow-hidden"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* HEADING */}
          <div className="text-center space-y-4">
            <Badge variant="outline" className="mb-4">
              Why ChromaKit?
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Built for Modern Design Systems
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The only React color picker with native OKLCH support and
              composable architecture
            </p>
          </div>

          {/* PERFORMANCE METRICS */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              icon={<Zap className="w-6 h-6 text-yellow-500" />}
              value="60 FPS"
              label="Silky smooth interactions"
              color="bg-yellow-500/10 text-yellow-500"
            />
            <MetricCard
              icon={<Package className="w-6 h-6 text-blue-500" />}
              value="8 KB"
              label="Gzipped bundle size"
              color="bg-blue-500/10 text-blue-500"
            />
            <MetricCard
              icon={<Code2 className="w-6 h-6 text-green-500" />}
              value="<3ms"
              label="Average re-render time"
              color="bg-green-500/10 text-green-500"
            />
            <MetricCard
              icon={<Sparkles className="w-6 h-6 text-purple-500" />}
              value="0"
              label="Memory leaks"
              color="bg-purple-500/10 text-purple-500"
            />
          </div>

          {/* TABS FOR DIFFERENT COMPARISONS */}
          <Tabs defaultValue="table" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="table">Feature Comparison</TabsTrigger>
              <TabsTrigger value="live">Live Demo</TabsTrigger>
            </TabsList>

            {/* COMPARISON TABLE */}
            <TabsContent value="table" className="mt-8">
              <Card className="p-6 md:p-8">
                <ComparisonTable />
              </Card>
            </TabsContent>

            {/* LIVE PICKER COMPARISON */}
            <TabsContent value="live" className="mt-8">
              <LivePickerComparison />
              <p className="text-center text-sm text-muted-foreground mt-6">
                Try adjusting colors on both pickers to see the difference in
                gradient quality
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
