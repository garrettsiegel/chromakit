import { useEffect, useRef, useState } from 'react';
import {
  ColorArea,
  HueSlider,
  OKLCHInputs,
  ColorInputs,
  ColorSwatch,
  CopyButton,
  useColorState,
} from '@/lib/color-picker';
import '@/components/home/HeroPicker.css';

const SWATCHES = ['#FF6B6B', '#2455F5', '#FFE338'];
const PARTS = ['area', 'hue', 'values', 'swatches'];

const useAssembly = () => {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const skip = useRef<HTMLButtonElement>(null);
  const finishAt = useRef(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const section = root.current;
    const scene = stage.current;
    if (!section || !scene) return;
    // KEEP IN SYNC WITH THE MATCHING MEDIA QUERY IN HeroPicker.css
    const media = window.matchMedia(
      '(prefers-reduced-motion: reduce), (max-height: 499px)'
    );
    let frame = 0;
    let top = 0;
    let distance = 1;
    let measured: {
      element: HTMLElement;
      x: number;
      y: number;
      sx: number;
      sy: number;
    }[] = [];

    const render = () => {
      frame = 0;
      const progress = media.matches
        ? 1
        : Math.max(0, Math.min(1, (window.scrollY - top) / distance));
      const assembled = progress >= 0.999;
      const active = document.activeElement;
      if (
        !assembled &&
        active instanceof HTMLElement &&
        active.closest('.hero-controls')
      )
        skip.current?.focus({ preventScroll: true });
      scene.style.setProperty('--progress', String(progress));
      scene.style.setProperty(
        '--chrome',
        // CHROME FADES IN WHILE THE WORDMARK FADES OUT
        String(Math.max(0, (progress - 0.6) / 0.4))
      );
      for (const part of measured) {
        const remaining = 1 - progress;
        part.element.style.setProperty(
          '--text-correction',
          String(
            (1 + (part.sx - 1) * remaining) / (1 + (part.sy - 1) * remaining)
          )
        );
        part.element.style.transform = `translate(${part.x * remaining}px, ${part.y * remaining}px) scale(${1 + (part.sx - 1) * remaining}, ${1 + (part.sy - 1) * remaining})`;
      }
      setReady(assembled);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const measure = () => {
      // STAGE STICKS BELOW THE HEADER; OFFSET THE START BY ITS TOP
      const stickyTop = parseFloat(window.getComputedStyle(scene).top) || 0;
      top = section.getBoundingClientRect().top + window.scrollY - stickyTop;
      distance = Math.max(1, section.offsetHeight - scene.offsetHeight);
      finishAt.current = media.matches ? top : top + distance;
      const bounds = scene.getBoundingClientRect();
      measured = PARTS.flatMap((name) => {
        const source = scene.querySelector<HTMLElement>(
          `.hero-source .slot-${name}`
        );
        const target = scene.querySelector<HTMLElement>(
          `.hero-target .slot-${name}`
        );
        const element = scene.querySelector<HTMLElement>(`.hero-part-${name}`);
        if (!source || !target || !element) return [];
        const a = source.getBoundingClientRect();
        const b = target.getBoundingClientRect();
        element.style.left = `${b.left - bounds.left}px`;
        element.style.top = `${b.top - bounds.top}px`;
        element.style.width = `${b.width}px`;
        element.style.height = `${b.height}px`;
        return [
          {
            element,
            x: a.left - b.left,
            y: a.top - b.top,
            sx: a.width / b.width,
            sy: a.height / b.height,
          },
        ];
      });
      schedule();
    };
    const observer = new window.ResizeObserver(measure);
    observer.observe(scene);
    media.addEventListener('change', measure);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('pageshow', measure);
    measure();
    void document.fonts.ready.then(() => {
      if (section.isConnected) measure();
    });
    return () => {
      observer.disconnect();
      media.removeEventListener('change', measure);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('pageshow', measure);
      cancelAnimationFrame(frame);
    };
  }, []);

  const skipToPicker = () => {
    window.scrollTo({ top: finishAt.current, behavior: 'instant' });
    requestAnimationFrame(() => {
      requestAnimationFrame(() =>
        stage.current
          ?.querySelector<HTMLElement>('[aria-label="Saturation"]')
          ?.focus({ preventScroll: true })
      );
    });
  };

  return { root, stage, skip, ready, skipToPicker };
};

const HeroSwatches = ({
  color,
}: {
  color: ReturnType<typeof useColorState>;
}) => (
  <div className="hero-part hero-part-swatches">
    {SWATCHES.map((swatch) => (
      <ColorSwatch
        key={swatch}
        color={swatch}
        selected={color.colorValue.hex.toLowerCase() === swatch.toLowerCase()}
        onClick={() => color.setFromString(swatch)}
      />
    ))}
  </div>
);

export const HeroPicker = () => {
  const color = useColorState('#FF6B6B');
  const { root, stage, skip, ready, skipToPicker } = useAssembly();

  return (
    <section
      className="hero"
      ref={root}
      aria-label="Interactive color composition"
    >
      <div className="hero-stage" ref={stage} data-ready={ready}>
        <div className="hero-bar">
          <span className="hero-formats">
            OKLCH · OKLAB · HSL · HSV · RGB · HEX
          </span>
          <button ref={skip} onClick={skipToPicker}>
            Skip to picker ↘
          </button>
        </div>
        <h1 className="hero-title">ChromaKit</h1>
        <div className="hero-ready-heading">
          <p>FROM COMPOSITION TO COMPONENT</p>
          <h2>Ready to use.</h2>
        </div>
        <div className="hero-source" aria-hidden="true">
          {PARTS.map((name) => (
            <div key={name} className={`slot-${name}`} />
          ))}
        </div>
        <div className="hero-target" aria-hidden="true">
          {PARTS.map((name) => (
            <div key={name} className={`slot-${name}`} />
          ))}
        </div>
        <div className="hero-controls" inert={!ready} aria-hidden={!ready}>
          <div className="hero-part hero-part-area">
            <ColorArea hsva={color.hsva} onChange={color.updateColor} />
          </div>
          <div className="hero-part hero-part-hue">
            <HueSlider
              hsva={color.hsva}
              onChange={color.updateColor}
              vertical
            />
          </div>
          <div className="hero-part hero-part-values">
            <div className="hero-readings" aria-hidden="true">
              {[
                ['L', color.colorValue.oklch.L.toFixed(2)],
                ['C', color.colorValue.oklch.C.toFixed(3)],
                ['H', color.colorValue.oklch.h.toFixed(1)],
              ].map(([label, value]) => (
                <div key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <div className="hero-editors">
              <span className="hero-label">OKLCH</span>
              <OKLCHInputs
                colorValue={color.colorValue}
                onChange={color.setFromString}
                showAlpha={false}
              />
              <span className="hero-label">HEX</span>
              <ColorInputs
                colorValue={color.colorValue}
                onChange={color.setFromString}
                format="hex"
                showCopyButton
              />
            </div>
          </div>
          <HeroSwatches color={color} />
        </div>
        <div className="hero-caption">
          <span>React color picker &amp; conversion toolkit.</span>
          <span>
            {ready ? 'Pick. Convert. Build.' : 'Scroll to assemble ↓'}
          </span>
        </div>
        <div className="hero-install">
          <code>npm install chromakit-react</code>
          <CopyButton text="npm install chromakit-react" />
          <a href="/docs/getting-started">
            Start building <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
