// web/src/components/Header.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import { Header } from './Header';
import { ThemeProvider } from '../context/ThemeContext';
import { JsonDataProvider } from '../context/JsonDataContext';

describe('Header', () => {
  it('hides sidebar button when no jsonData', () => {
    render(
      <ThemeProvider>
        <JsonDataProvider>
          <Header sidebarOpen={false} setSidebarOpen={vi.fn()} />
        </JsonDataProvider>
      </ThemeProvider>
    );
    expect(screen.queryByLabelText(/toggle sidebar/i)).toBeNull();
  });
});