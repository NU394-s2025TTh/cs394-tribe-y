import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import EvaluateAllButton from './EvaluateAllButton';

// Mock dependencies
vi.mock('../../data/extracted_queries.json', () => ({
  default: [{ query: 'What is AI?', answer: 'Artificial Intelligence' }],
}));
vi.mock('../../data/qa_pairs.json', () => ({
  default: {
    'What is AI?': 'Artificial Intelligence',
  },
}));
vi.mock('../../lib/faqMatcher', () => ({
  matchQueryToFAQs: vi.fn(async (query: string) => ({
    answer: 'Artificial Intelligence',
    similarity: 1,
  })),
}));
vi.mock('./MatchTable', () => ({
  __esModule: true,
  default: ({ results }: { results: any[] }) => (
    <div data-testid="mock-match-table">{JSON.stringify(results)}</div>
  ),
}));
vi.mock('./qaStyles.module.css', () => ({
  button: 'mocked-button-class',
}));

describe('EvaluateAllButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders upload input and evaluate button', () => {
    render(<EvaluateAllButton />);
    expect(screen.getByTestId('qa-upload-input')).toBeInTheDocument();
    expect(screen.getByTestId('evaluate-btn')).toBeInTheDocument();
  });

  it('shows error for invalid JSON file', async () => {
    render(<EvaluateAllButton />);
    const file = new File(['not json'], 'qa_pairs.json', {
      type: 'application/json',
    });
    const input = screen.getByTestId('qa-upload-input');
    await fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() =>
      expect(screen.getByText(/invalid json file/i)).toBeInTheDocument()
    );
  });

  it('shows error for empty or invalid QA pairs', async () => {
    render(<EvaluateAllButton />);
    const file = new File(['{}'], 'qa_pairs.json', {
      type: 'application/json',
    });
    const input = screen.getByTestId('qa-upload-input');
    await fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() =>
      expect(screen.getByText(/no valid qa pairs found/i)).toBeInTheDocument()
    );
  });

  it('accepts valid QA pairs object', async () => {
    render(<EvaluateAllButton />);
    const validJson = JSON.stringify({
      'What is AI?': 'Artificial Intelligence',
    });
    const file = new File([validJson], 'qa_pairs.json', {
      type: 'application/json',
    });
    const input = screen.getByTestId('qa-upload-input');
    await fireEvent.change(input, { target: { files: [file] } });
    // No error should be shown
    await waitFor(() =>
      expect(screen.queryByText(/invalid json file/i)).not.toBeInTheDocument()
    );
    await waitFor(() =>
      expect(
        screen.queryByText(/no valid qa pairs found/i)
      ).not.toBeInTheDocument()
    );
  });

  it('accepts valid QA pairs array', async () => {
    render(<EvaluateAllButton />);
    const validArray = JSON.stringify([
      { query: 'What is AI?', answer: 'Artificial Intelligence' },
    ]);
    const file = new File([validArray], 'qa_pairs.json', {
      type: 'application/json',
    });
    const input = screen.getByTestId('qa-upload-input');
    await fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() =>
      expect(screen.queryByText(/invalid json file/i)).not.toBeInTheDocument()
    );
    await waitFor(() =>
      expect(
        screen.queryByText(/no valid qa pairs found/i)
      ).not.toBeInTheDocument()
    );
  });

  it('runs evaluation and displays accuracy and results', async () => {
    render(<EvaluateAllButton />);
    const button = screen.getByTestId('evaluate-btn');
    await fireEvent.click(button);
    await waitFor(() =>
      expect(screen.getByText(/accuracy/i)).toBeInTheDocument()
    );
    expect(screen.getByTestId('mock-match-table')).toBeInTheDocument();
  });
});
