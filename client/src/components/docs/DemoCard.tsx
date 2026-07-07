import type { ReactNode } from 'react';
import type { Language } from 'prism-react-renderer';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CodeBlock } from '@/components/demo/CodeBlock';

interface DemoCardProps {
  code: string;
  language?: Language;
  children: ReactNode;
}

export const DemoCard = ({ code, language = 'tsx', children }: DemoCardProps) => {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <Tabs defaultValue="preview" className="w-full">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <TabsContent
            value="preview"
            className="mt-4 flex flex-wrap items-center justify-center gap-6 rounded-lg bg-muted/30 p-6"
          >
            {children}
          </TabsContent>
          <TabsContent value="code" className="mt-4">
            <CodeBlock code={code} language={language} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
