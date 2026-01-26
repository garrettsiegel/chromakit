/// <reference types="vitest" />
import '@testing-library/jest-dom/vitest';

declare global {
  namespace Vi {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
    interface Assertion<T = any> extends jest.Matchers<void, T> {}
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type  
    interface AsymmetricMatchersContaining extends jest.AsymmetricMatchers {}
  }
}
