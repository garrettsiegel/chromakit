import styles from './chromakit.css?inline';

let injected = false;

export function injectStyles(): void {
  // Skip if already injected or not in browser environment
  if (injected || typeof document === 'undefined') {
    return;
  }

  // Check if styles are already present (e.g., from manual CSS import)
  const existingStyle = document.querySelector('style[data-chromakit]');
  if (existingStyle) {
    injected = true;
    return;
  }

  // Create and inject style element
  const styleElement = document.createElement('style');
  styleElement.setAttribute('data-chromakit', '');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
  injected = true;
}
