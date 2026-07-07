import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { DemoPlayground } from '@/components/home/DemoPlayground';
import { UsageSection } from '@/components/home/UsageSection';
import { FinalCTA } from '@/components/home/FinalCTA';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <HeroSection />
      <FeaturesSection />
      <DemoPlayground />
      <UsageSection />
      <FinalCTA />
      <SiteFooter />
    </div>
  );
}
