import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OverviewView } from './OverviewView';
import { useJsonData } from '../../context/JsonDataContext';

vi.mock('../../context/JsonDataContext', () => ({
  useJsonData: vi.fn()
}));

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn()
  }
});

global.URL.createObjectURL = vi.fn(() => 'blob:http://mock');

describe('OverviewView', () => {
  const mockData = {
    metadata: {
      fileName: 'testfile.json',
      fileSize: '20KB',
      dateUploaded: '2025-06-01',
      itemCount: '8'
    },
    raw: {
      data: [
        {
          body: 'Received question: What is AI?',
          trace_id: 't1',
          timestamp: 1
        },
        {
          body: 'Query from user',
          trace_id: 't1',
          timestamp: 2
        },
        {
          body: 'Response time: 1.00',
          trace_id: 't1',
          timestamp: 3
        },
        {
          body: 'Running step: chat',
          trace_id: 't1',
          timestamp: 4
        },
        {
          body: 'Running step: code generator',
          trace_id: 't1',
          timestamp: 6
        },
        {
          body: 'warning!',
          severity_text: 'WARN',
          trace_id: 't1',
          timestamp: 7
        }
      ]
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing if jsonData is null', () => {
    (useJsonData as any).mockReturnValue({ jsonData: null });
    const { container } = render(<OverviewView />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders metadata fields', () => {
    (useJsonData as any).mockReturnValue({ jsonData: mockData });
    render(<OverviewView />);
    expect(screen.getByText('testfile.json')).toBeInTheDocument();
    expect(screen.getByText('20KB')).toBeInTheDocument();
    expect(screen.getByText('2025-06-01')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('renders overview title and sections', () => {
    (useJsonData as any).mockReturnValue({ jsonData: mockData });
    render(<OverviewView />);
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Query Statistics')).toBeInTheDocument();
    expect(screen.getByText('Preview')).toBeInTheDocument();
  });

  it('calculates response times and displays mean/median', () => {
    (useJsonData as any).mockReturnValue({ jsonData: mockData });
    render(<OverviewView />);
    expect(screen.getAllByText('1.00').length).toBeGreaterThanOrEqual(2);
  });

  it('shows warning count and associated traceId', () => {
    (useJsonData as any).mockReturnValue({ jsonData: mockData });
    render(<OverviewView />);
    const warningSection = screen.getByText('Warnings (Severity = WARN)').closest('div');
    expect(within(warningSection!).getByText('1')).toBeInTheDocument();
    expect(screen.getByText(/trace id/i)).toBeInTheDocument();
  });

  it('renders download button and triggers download', () => {
    (useJsonData as any).mockReturnValue({ jsonData: mockData });
    render(<OverviewView />);
    fireEvent.click(screen.getByText('Download'));
    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });

  it('displays step statistics section and labels', () => {
    (useJsonData as any).mockReturnValue({ jsonData: mockData });
    render(<OverviewView />);
    const stepSection = screen.getByText('Sub-query (Running) Step Statistics').closest('div');
    expect(within(stepSection!).getByText((_, node) => node?.textContent === 'chat')).toBeInTheDocument();
  });

  it('shows raw JSON preview in pre tag', () => {
    (useJsonData as any).mockReturnValue({ jsonData: mockData });
    render(<OverviewView />);
    expect(screen.getByText(/Received question: What is AI/)).toBeInTheDocument();
  });
});
