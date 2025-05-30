import React from 'react';
import { useJsonData } from '../../context/JsonDataContext';
import { DownloadIcon, ClipboardCopy } from 'lucide-react';
//import { StructureSummary } from '../visualizations/StructureSummary';

export const OverviewView: React.FC = () => {
  const { jsonData } = useJsonData();
  if (!jsonData) return null;

  // flatten to an array of log entries
  const logs: any[] = Array.isArray(jsonData.raw)
    ? jsonData.raw
    : Array.isArray(jsonData.raw.data)
    ? jsonData.raw.data
    : [];

  // overall response‐time metrics
  const responseTimes = extractResponseTimes(logs);
  const mean = calculateMean(responseTimes).toFixed(2);
  const median = calculateMedian(responseTimes).toFixed(2);
  const queryCount = countUserQueries(logs);
  const outliers = detectOutliers(responseTimes).map(v => v.toFixed(2));

  // warnings/context
  const warnings = getWarningsWithQuestionContext(logs);
  const warningCount = warnings.length;

  // per–“Running step” durations
  const stepStats = getStepDurations(logs);

  // download & copy
  const handleDownload = () => {
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${jsonData.metadata?.fileName || 'data'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(logs, null, 2))
      .then(() => alert('JSON copied to clipboard!'))
      .catch(err => console.error('Failed to copy: ', err));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Overview</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleCopyToClipboard}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
          >
            <ClipboardCopy className="h-4 w-4 mr-2" />
            Copy
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            <DownloadIcon className="h-4 w-4 mr-2" />
            Download
          </button>
        </div>
      </div>

      {/* File Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">File Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">File Name</p>
              <p className="text-gray-800 dark:text-white font-medium">{jsonData.metadata?.fileName || 'Unknown'}</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">File Size</p>
              <p className="text-gray-800 dark:text-white font-medium">{jsonData.metadata?.fileSize || 'Unknown'}</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Upload Date</p>
              <p className="text-gray-800 dark:text-white font-medium">{jsonData.metadata?.dateUploaded || 'Unknown'}</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Item Count</p>
              <p className="text-gray-800 dark:text-white font-medium">{jsonData.metadata?.itemCount || '0'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Query Statistics */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Query Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total User Queries</p>
            <p className="text-gray-800 dark:text-white font-medium">{queryCount}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Mean Response Time (s)</p>
            <p className="text-gray-800 dark:text-white font-medium">{mean}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Median Response Time (s)</p>
            <p className="text-gray-800 dark:text-white font-medium">{median}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Outlier Response Times (±2σ)</p>
            <p className="text-gray-800 dark:text-white font-medium break-words">{outliers.length ? outliers.join(', ') : 'None'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Warnings (Severity = WARN)</p>
            <p className="text-gray-800 dark:text-white font-medium">{warningCount}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              User Questions with Warnings
            </p>
            <ol className="text-gray-800 dark:text-white text-sm list-decimal list-inside space-y-1 max-h-32 overflow-y-auto">
              {warnings.map((w, i) => (
                <li key={i}>
                  <span className="font-semibold">(trace id) {w.traceId}</span>: {w.question ?? '—'}
                </li>
              ))}
            </ol>
          </div>

        </div>
      </div>

      {/* Running Step Durations */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Sub-query (Running) Step Statistics</h3>
        <div className="space-y-4">
          {stepStats.map(stat => (
            <div key={stat.step} className="border-t border-gray-300 dark:border-gray-600 pt-2">
              <h4 className="text-md font-semibold text-blue-600 dark:text-blue-400 capitalize">{stat.step}</h4>
              <div className="grid grid-cols-3 gap-4 text-sm mt-1">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Mean (ms)</p>
                  <p className="text-gray-800 dark:text-white font-medium">{stat.mean.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Median (ms)</p>
                  <p className="text-gray-800 dark:text-white font-medium">{stat.median.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Outliers (ms)</p>
                  <p className="text-gray-800 dark:text-white font-medium break-words">
                    {stat.outliers.length > 0 ? stat.outliers.map(v => v.toFixed(2)).join(', ') : 'None'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Preview</h3>
        <div className="overflow-auto max-h-96">
          <pre className="text-sm text-gray-700 dark:text-gray-300 font-mono leading-relaxed p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
            {JSON.stringify(logs, null, 2).slice(0, 1000)}
            {JSON.stringify(logs, null, 2).length > 1000 ? '...' : ''}
          </pre>
        </div>
      </div>
    </div>
  );
};

// ─── Helper Functions ───────────────────────────────────────────────────────────

function extractResponseTimes(logs: any[]): number[] {
  return logs
    .map(e => {
      const m = typeof e.body === 'string' && e.body.match(/Response time: (\d+\.\d+)/);
      return m ? parseFloat(m[1]) : null;
    })
    .filter((n): n is number => n !== null);
}

function calculateMean(values: number[]): number {
  return values.length === 0
    ? 0
    : values.reduce((sum, val) => sum + val, 0) / values.length;
}

function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function countUserQueries(logs: any[]): number {
  const ids = new Set<string>();
  logs.forEach(e => {
    if (typeof e.body === 'string' && e.body.includes('Query from user') && e.trace_id) {
      ids.add(e.trace_id);
    }
  });
  return ids.size;
}

function detectOutliers(values: number[]): number[] {
  if (values.length === 0) return [];
  const mean = calculateMean(values);
  const stdDev = Math.sqrt(
    values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length
  );
  const lower = mean - 2 * stdDev;
  const upper = mean + 2 * stdDev;
  return values.filter(v => v < lower || v > upper);
}

type WarningInfo = {
  traceId?: string;
  question?: string;
};

function getWarningsWithQuestionContext(logs: any[]): WarningInfo[] {
  const results: WarningInfo[] = [];
  let lastContextQuery: string | undefined;
  let lastTraceId: string | undefined;

  logs.forEach(e => {
    // whenever we hit the "Received question" span, grab its Context query
    if (typeof e.body === 'string' && e.body.includes('Received question')) {
      lastTraceId = e.trace_id;
      const ctxMatch = e.body.match(/\[Context query:\s*([^\]]+)\]/);
      lastContextQuery = ctxMatch ? ctxMatch[1] : undefined;
    }

    // when we see a WARN, emit the last context + trace
    if (e.severity_text === 'WARN') {
      results.push({
        traceId: e.trace_id || lastTraceId,
        question: lastContextQuery,
      });
    }
  });

  return results;
}

type StepStats = {
  step: string;
  durations: number[];
  mean: number;
  median: number;
  outliers: number[];
};

function getStepDurations(logs: any[]): StepStats[] {
  // extract only those entries whose body ends in "Running step: X"
  const events = logs
    .map(e => {
      if (typeof e.body !== 'string') return null;
      const m = e.body.match(/Running step: (.+)$/);
      return m ? { step: m[1], t: e.timestamp } : null;
    })
    .filter((e): e is { step: string; t: number } => e !== null)
    .sort((a, b) => a.t - b.t);

  // bucket durations by step
  const buckets: Record<string, number[]> = {};
  for (let i = 0; i < events.length - 1; i++) {
    const curr = events[i];
    const next = events[i + 1];
    // diff in seconds → convert to ms
    const durMs = (next.t - curr.t) * 1000;
    buckets[curr.step] = buckets[curr.step] || [];
    buckets[curr.step].push(durMs);
  }

  // compute stats for each
  return Object.entries(buckets).map(([step, durations]) => ({
    step,
    durations,
    mean: calculateMean(durations),
    median: calculateMedian(durations),
    outliers: detectOutliers(durations),
  }));
}

