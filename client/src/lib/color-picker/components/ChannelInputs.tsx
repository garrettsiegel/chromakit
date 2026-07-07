import { useState } from 'react';

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

interface ChannelInputsProps<K extends string> {
  channels: ChannelConfig<K>[];
  values: Record<K, number>;
  onChannelChange: (key: K, value: number) => void;
  className?: string;
}

// SHARED NUMERIC CHANNEL GRID. THE FOCUSED FIELD SHOWS THE RAW TYPED TEXT
// (DRAFT) SO ROUND-TRIPPED COLOR UPDATES NEVER SNAP THE VALUE MID-EDIT;
// EVERY OTHER FIELD DERIVES STRAIGHT FROM PROPS.
export function ChannelInputs<K extends string>({
  channels,
  values,
  onChannelChange,
  className = '',
}: ChannelInputsProps<K>) {
  const [draft, setDraft] = useState<{ key: K; text: string } | null>(null);

  const handleChange = (channel: ChannelConfig<K>, raw: string) => {
    setDraft({ key: channel.key, text: raw });
    const parsed = parseFloat(raw) || 0;
    const clamped = Math.max(channel.min, Math.min(channel.max, parsed));
    onChannelChange(channel.key, clamped);
  };

  return (
    <div
      className={`ck-channel-grid ck-channel-grid-${channels.length} ${className}`}
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
