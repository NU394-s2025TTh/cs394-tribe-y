import React from 'react';
import { useJsonData } from '../../context/JsonDataContext';
import { DownloadIcon, ClipboardCopy } from 'lucide-react';
import { StructureSummary } from '../visualizations/StructureSummary';

export const OverviewView: React.FC = () => {
  const { jsonData } = useJsonData();

  if (!jsonData) return null;

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
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Recommended Views</h3>
          <div className="space-y-3">
            {getRecommendedViews(jsonData.structure).map((view, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${view.color}`}></div>
                <span className="text-gray-800 dark:text-white">{view.name}</span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{view.reason}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Data Structure</h3>
        <StructureSummary structure={jsonData.structure} />
      </div>
      
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

function getRecommendedViews(structure: any): { name: string; color: string; reason: string }[] {
  const recommendations = [];
  
  if (structure?.type === 'array' && structure?.isHomogeneous) {
    recommendations.push({
      name: 'Table View',
      color: 'bg-blue-500',
      reason: 'Uniform array data'
    });
    
    recommendations.push({
      name: 'Chart View',
      color: 'bg-green-500',
      reason: 'Potential data visualization'
    });
  }
  
  if (structure?.type === 'object' && structure?.keyCount > 0) {
    recommendations.push({
      name: 'Tree View',
      color: 'bg-purple-500',
      reason: 'Nested object structure'
    });
  }
  
  if (recommendations.length === 0) {
    recommendations.push({
      name: 'Raw JSON View',
      color: 'bg-gray-500',
      reason: 'Complex or simple data'
    });
  }
  
  return recommendations;
}