import { DemoCard } from '@/components/docs/DemoCard';
import { basicUsageCode } from '@/site-data/getting-started-snippets';
import { BasicDemo } from './BasicDemo';

// One React island = one hydrated tree. Astro renders framework-component
// children as static slots, so the live demo must live INSIDE the island
// (here) rather than be passed as a child from the .astro page.
export const BasicDemoCard = () => (
  <DemoCard code={basicUsageCode}>
    <BasicDemo />
  </DemoCard>
);
