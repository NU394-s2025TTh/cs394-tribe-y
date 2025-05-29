import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MatchTable from '../MatchTable';

describe('MatchTable Component', () => {
  // Sample test data
  const sampleResults = [
    {
      query: 'Test Query 1',
      expected: 'Expected Result 1',
      actual: 'Actual Result 1',
      matched: 'Matched Result 1',
      similarity: 0.95,
      correct: true,
    },
    {
      query: 'Test Query 2',
      expected: 'Expected Result 2',
      actual: 'Actual Result 2',
      matched: 'Matched Result 2',
      similarity: 0.45,
      correct: false,
    },
  ];

  it('renders the table headers correctly', () => {
    render(<MatchTable results={sampleResults} />);

    expect(screen.getByText('Query')).toBeInTheDocument();
    expect(screen.getByText('Expected')).toBeInTheDocument();
    expect(screen.getByText('Actual')).toBeInTheDocument();
    expect(screen.getByText('Matched')).toBeInTheDocument();
    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('✅')).toBeInTheDocument();
  });

  it('renders the correct number of rows', () => {
    render(<MatchTable results={sampleResults} />);

    // Headers row + 2 data rows
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3);
  });

  it('displays query text correctly', () => {
    render(<MatchTable results={sampleResults} />);

    expect(screen.getByText('Test Query 1')).toBeInTheDocument();
    expect(screen.getByText('Test Query 2')).toBeInTheDocument();
  });

  it('displays expected results correctly', () => {
    render(<MatchTable results={sampleResults} />);

    expect(screen.getByText('Expected Result 1')).toBeInTheDocument();
    expect(screen.getByText('Expected Result 2')).toBeInTheDocument();
  });

  it('displays actual results correctly', () => {
    render(<MatchTable results={sampleResults} />);

    expect(screen.getByText('Actual Result 1')).toBeInTheDocument();
    expect(screen.getByText('Actual Result 2')).toBeInTheDocument();
  });

  it('displays matched results correctly', () => {
    render(<MatchTable results={sampleResults} />);

    expect(screen.getByText('Matched Result 1')).toBeInTheDocument();
    expect(screen.getByText('Matched Result 2')).toBeInTheDocument();
  });

  it('formats similarity scores correctly', () => {
    render(<MatchTable results={sampleResults} />);

    expect(screen.getByText('0.95')).toBeInTheDocument();
    expect(screen.getByText('0.45')).toBeInTheDocument();
  });

  it('displays correct status indicators', () => {
    render(<MatchTable results={sampleResults} />);

    const checkmarks = screen.getAllByText('✔️');
    const crosses = screen.getAllByText('❌');

    expect(checkmarks).toHaveLength(1);
    expect(crosses).toHaveLength(1);
  });

  it('renders empty table when no results are provided', () => {
    render(<MatchTable results={[]} />);

    // Should only have the header row
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(1);
  });

  it('handles extreme similarity values correctly', () => {
    const extremeResults = [
      {
        query: 'Perfect Match',
        expected: 'Result',
        actual: 'Result',
        matched: 'Result',
        similarity: 1.0,
        correct: true,
      },
      {
        query: 'No Match',
        expected: 'Result',
        actual: 'Different',
        matched: 'None',
        similarity: 0.0,
        correct: false,
      },
    ];

    render(<MatchTable results={extremeResults} />);

    expect(screen.getByText('1.00')).toBeInTheDocument();
    expect(screen.getByText('0.00')).toBeInTheDocument();
  });
});
