import React from 'react';
import { useJsonData } from '../../context/JsonDataContext';
import { DownloadIcon, ClipboardCopy } from 'lucide-react';
//import { StructureSummary } from '../visualizations/StructureSummary';

export const OverviewView: React.FC = () => {
  const { jsonData } = useJsonData();

  if (!jsonData) return null;

  const responseTimes = extractResponseTimes(jsonData.raw);
  const mean = calculateMean(responseTimes).toFixed(2);
  const median = calculateMedian(responseTimes).toFixed(2);
  const queryCount = countUserQueries(jsonData.raw);
  const outliers = detectOutliers(responseTimes).map(v => v.toFixed(2));
  const warnings = getWarningsWithQuestionContext(jsonData.raw);
  const warningCount = warnings.length;

  const handleDownload = () => {
    const dataStr = JSON.stringify(jsonData.raw, null, 2);
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
    const dataStr = JSON.stringify(jsonData.raw, null, 2);
    navigator.clipboard.writeText(dataStr)
      .then(() => alert('JSON copied to clipboard!'))
      .catch(err => console.error('Failed to copy: ', err));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
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
              <p className="text-gray-800 dark:text-white font-medium break-words">{outliers.length > 0 ? outliers.join(', ') : '0'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Warnings (Severity = WARN)</p>
              <p className="text-gray-800 dark:text-white font-medium">{warningCount}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">User Questions with Warnings</p>
              <ul className="text-gray-800 dark:text-white text-sm list-disc list-inside space-y-1 max-h-32 overflow-y-auto">
                {warnings.map((warn, i) => (
                  <li key={i}>
                    {warn.userQuestion ? warn.userQuestion : <span className="italic text-gray-500">Unknown user question</span>}
                  </li>
                ))}
              </ul>
            </div>
        </div>
      </div>
      
{/*       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Data Structure</h3>
        <StructureSummary structure={jsonData.structure} />
      </div> */}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Preview</h3>
        <div className="overflow-auto max-h-96">
          <pre className="text-sm text-gray-700 dark:text-gray-300 font-mono leading-relaxed p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
            {JSON.stringify(jsonData.raw, null, 2).slice(0, 1000)}
            {JSON.stringify(jsonData.raw, null, 2).length > 1000 ? '...' : ''}
          </pre>
        </div>
      </div>
    </div>
  );
};



// ----Helper Functions----

function extractResponseTimes(jsonData: any): number[] {
  const times: number[] = [];

  if (!jsonData?.data) return times;

  for (const trace of jsonData.data) {
    for (const span of trace.spans) {
      const opName: string = span.operationName;
      const match = opName.match(/Response time: (\d+\.\d+)/);
      if (match) {
        times.push(parseFloat(match[1]));
      }
    }
  }

  return times;
}

function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function countUserQueries(jsonData: any): number {
  if (!jsonData?.data) return 0;

  let count = 0;
  for (const trace of jsonData.data) {
    for (const span of trace.spans) {
      if (span.operationName.includes("Query from user")) {
        count += 1;
      }
    }
  }

  return count;
}

function detectOutliers(values: number[]): number[] {
  if (values.length === 0) return [];

  const mean = calculateMean(values);
  const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);
  const lower = mean - 2 * stdDev;
  const upper = mean + 2 * stdDev;

  return values.filter(val => val < lower || val > upper);
}

type WarningInfo = {
  userQuestion?: string;
  warningSpanID: string;
};

function getWarningsWithQuestionContext(jsonData: any): WarningInfo[] {
  const results: WarningInfo[] = [];

  if (!jsonData?.data) return results;

  for (const trace of jsonData.data) {
    let lastQuestionOp: string | undefined = undefined;

    for (const span of trace.spans) {
      // Track the most recent LLM question
      if (span.operationName.includes("Received question")) {
        lastQuestionOp = span.operationName;
      }

      // Check if this span is a warning
      const isWarn = span.tags?.some(
        (tag: any) => tag.key === "severity_text" && tag.value === "WARN"
      );

      if (isWarn) {
        results.push({
          userQuestion: lastQuestionOp,
          warningSpanID: span.spanID,
        });
      }
    }
  }

  return results;
}