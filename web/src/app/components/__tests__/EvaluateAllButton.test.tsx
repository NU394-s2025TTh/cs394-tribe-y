import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EvaluateAllButton from '../EvaluateAllButton';

describe('EvaluateAllButton', () => {
  it('renders the evaluate button', () => {
    render(<EvaluateAllButton />);
    expect(
      screen.getByRole('button', { name: /evaluate all queries/i })
    ).toBeInTheDocument();
  });
});
