import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  ColorArea,
  HueSlider,
  AlphaSlider,
  ColorPreview,
  RGBInputs,
  HSLInputs,
  HSVInputs,
  OKLCHInputs,
  useColorState,
} from '@/lib/color-picker';
import { ColorFormatsDisplay } from './ColorFormatsDisplay';

const COLOR_AREA_CONFIG = {
  width: 320,
  height: 160,
} as const;

export function CustomPickerDemo() {
  const { hsva, colorValue, updateColor, setFromString, startDrag, endDrag } =
    useColorState('#6366F1');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Build Your Own Picker</CardTitle>
        <CardDescription>
          Compose individual components to create a custom color picker
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-4">
          <ColorArea
            hsva={hsva}
            onChange={updateColor}
            onStart={startDrag}
            onEnd={endDrag}
            {...COLOR_AREA_CONFIG}
          />
          <div className="flex gap-4 items-start">
            <ColorPreview colorValue={colorValue} size="lg" />
            <div className="flex-1 space-y-3">
              <HueSlider
                hsva={hsva}
                onChange={updateColor}
                onStart={startDrag}
                onEnd={endDrag}
              />
              <AlphaSlider
                hsva={hsva}
                onChange={updateColor}
                onStart={startDrag}
                onEnd={endDrag}
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="rgb" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="rgb" className="flex-1">
              RGB
            </TabsTrigger>
            <TabsTrigger value="hsl" className="flex-1">
              HSL
            </TabsTrigger>
            <TabsTrigger value="hsv" className="flex-1">
              HSV
            </TabsTrigger>
            <TabsTrigger value="oklch" className="flex-1">
              OKLCH
            </TabsTrigger>
          </TabsList>
          <TabsContent value="rgb" className="mt-4">
            <RGBInputs colorValue={colorValue} onChange={setFromString} />
          </TabsContent>
          <TabsContent value="hsl" className="mt-4">
            <HSLInputs colorValue={colorValue} onChange={setFromString} />
          </TabsContent>
          <TabsContent value="hsv" className="mt-4">
            <HSVInputs colorValue={colorValue} onChange={setFromString} />
          </TabsContent>
          <TabsContent value="oklch" className="mt-4">
            <OKLCHInputs colorValue={colorValue} onChange={setFromString} />
          </TabsContent>
        </Tabs>

        <ColorFormatsDisplay colorValue={colorValue} />
      </CardContent>
    </Card>
  );
}
