import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';
import { expect } from 'vitest';

// Extend Vitest matchers with jest-axe
expect.extend(toHaveNoViolations);
import '@testing-library/jest-dom/vitest';
