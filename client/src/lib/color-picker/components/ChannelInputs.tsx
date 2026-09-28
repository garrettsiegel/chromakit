import { useState } from 'react';
import { clamp } from '../conversions/math';

export interface ChannelConfig<K extends string = string> {
  key: K;
  label: string;
  inputId: string;
  testId: string;
  min: number;
  max: number;
  step?: number;
  format: (value: number) => string | number;
}

export interface ChannelInputsProps<K extends string> {
  channels: ChannelConfig<K>[];
  values: Record<K, number>;
  onChannelChange: (key: K, value: number) => void;
  className?: string;
}

// FOCUSED FIELD SHOWS ITS RAW DRAFT SO ROUND-TRIPPED UPDATES NEVER SNAP IT MID-EDIT
export function ChannelInputs<K extends string>({
  channels,
  values,
  onChannelChange,
  className = '',
}: ChannelInputsProps<K>) {
  const [draft, setDraft] = useState<{ key: K; text: string } | null>(null);

  const handleChange = (channel: ChannelConfig<K>, raw: string) => {
    setDraft({ key: channel.key, text: raw });
    // DON'T COMMIT EMPTY OR NON-NUMERIC TEXT, SO CLEARING A FIELD NEVER PAINTS A 0
    const parsed = parseFloat(raw);
    if (raw.trim() === '' || Number.isNaN(parsed)) return;
    onChannelChange(channel.key, clamp(parsed, channel.min, channel.max));
  };

  return (
    <div
      className={`ck-channel-grid ck-channel-grid-${channels.length} ${className}`.trim()}
    >
      {channels.map((channel) => (
        <div key={channel.key} className="ck-channel">
          <label htmlFor={channel.inputId} className="ck-channel-label">
            {channel.label}
          </label>
          <input
            id={channel.inputId}
            type="number"
            min={channel.min}
            max={channel.max}
            step={channel.step}
            value={
              draft?.key === channel.key
                ? draft.text
                : channel.format(values[channel.key])
            }
            onChange={(e) => handleChange(channel, e.target.value)}
            onBlur={() => setDraft(null)}
            className="ck-channel-input"
            data-testid={channel.testId}
          />
        </div>
      ))}
    </div>
  );
}
