/// <reference types="vitest" />
import '@testing-library/jest-dom/vitest';

declare global {
  namespace Vi {
    interface Assertion<T = any> extends jest.Matchers<void, T> {}
    interface AsymmetricMatchersContaining extends jest.AsymmetricMatchers {}
  }
}
