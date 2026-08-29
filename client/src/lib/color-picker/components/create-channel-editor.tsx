import { useCallback } from 'react';
import type { ColorValue } from '../types';
import { ChannelInputs, type ChannelConfig } from './ChannelInputs';

export interface ChannelEditorProps {
  colorValue: ColorValue;
  onChange: (colorString: string) => void;
  showAlpha?: boolean;
  className?: string;
}

/** A channel minus the ids, which are derived from the space name and key. */
type ChannelSpec<K extends string> = Omit<
  ChannelConfig<K>,
  'inputId' | 'testId'
>;

interface ChannelEditorConfig<K extends string, V extends Record<K, number>> {
  /** Lowercase color-space name, used for element ids and test ids. */
  space: string;
  /** Channels in display order; the alpha channel must come last. */
  channels: ChannelSpec<K>[];
  /** Pull this space's channel values out of the current color. */
  select: (colorValue: ColorValue) => V;
  /** Render an edited set of channels as a string `parseColor` understands. */
  serialize: (values: V) => string;
}

/**
 * Build one of the per-space channel editors (RGB, HSL, OKLCH, ...). They only
 * differ in their channel table and how an edit is serialized back to a color
 * string, so the shell around `ChannelInputs` is written once here.
 */
export function createChannelEditor<
  K extends string,
  V extends Record<K, number>,
>({ space, channels, select, serialize }: ChannelEditorConfig<K, V>) {
  const allChannels: ChannelConfig<K>[] = channels.map((channel) => {
    const id = channel.key.toLowerCase();
    return {
      ...channel,
      inputId: `ck-${space}-input-${id}`,
      testId: `${space}-input-${id}`,
    };
  });
  const opaqueChannels = allChannels.slice(0, -1);

  function ChannelEditor({
    colorValue,
    onChange,
    showAlpha = true,
    className = '',
  }: ChannelEditorProps) {
    // Each `ColorValue` field is a stable object per color, so this is a
    // stable dependency for the change handler below.
    const values = select(colorValue);

    const handleChannelChange = useCallback(
      (key: K, value: number) => {
        onChange(serialize({ ...values, [key]: value }));
      },
      [onChange, values]
    );

    return (
      <ChannelInputs
        channels={showAlpha ? allChannels : opaqueChannels}
        values={values}
        onChannelChange={handleChannelChange}
        className={className}
      />
    );
  }

  ChannelEditor.displayName = `${space.toUpperCase()}Inputs`;
  return ChannelEditor;
}
