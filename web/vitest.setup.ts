import '@testing-library/jest-dom'; 
import { vi } from 'vitest';

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});



global.URL.createObjectURL = vi.fn(() => 'blob:fake-url');
global.alert = vi.fn();
