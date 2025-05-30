import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileJson, Upload } from 'lucide-react';
import { useJsonData } from '../context/JsonDataContext';
import { cn } from '../lib/utils';

export const FileUploader: React.FC = () => {
  const { setJsonData, error, setError } = useJsonData();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setError(null);
    
    if (file) {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const result = event.target?.result as string;
          const jsonData = JSON.parse(result);
          
          // Process file metadata
          const metadata = {
            fileName: file.name,
            fileSize: formatFileSize(file.size),
            itemCount: countItems(jsonData),
            dateUploaded: new Date().toLocaleString()
          };
          
          // Process and analyze the data structure
          const dataStructure = analyzeDataStructure(jsonData);
          
          setJsonData({
            raw: jsonData,
            metadata,
            structure: dataStructure
          });
        } catch (error) {
          console.error('Error parsing JSON:', error);
          setError('Invalid JSON format. Please check your file and try again.');
        }
      };
      
      reader.onerror = () => {
        setError('Error reading file. Please try again.');
      };
      
      reader.readAsText(file);
    }
  }, [setJsonData, setError]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json']
    },
    maxFiles: 1
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
      <div className="text-center mb-8">
        <FileJson className="h-16 w-16 mx-auto text-blue-600 dark:text-blue-400 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          TNE.ai Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          Upload your AI-model metrics JSON to visualize performance insights.
        </p>
      </div>
      
      <div 
        {...getRootProps()} 
        className={cn(
          "w-full max-w-xl p-8 border-2 border-dashed rounded-xl transition-colors duration-200 cursor-pointer",
          "hover:bg-gray-50 dark:hover:bg-gray-800/50",
          isDragActive && "bg-gray-50 dark:bg-gray-800/50",
          isDragAccept && "border-green-500 bg-green-50 dark:bg-green-900/20",
          isDragReject && "border-red-500 bg-red-50 dark:bg-red-900/20",
          !isDragActive && "border-gray-300 dark:border-gray-700"
        )}
      >
        <input {...(getInputProps() as React.InputHTMLAttributes<HTMLInputElement>)} />
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500" />
          {isDragActive ? (
            <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
              Drop your JSON file here...
            </p>
          ) : (
            <>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
                Drag &amp; drop a JSON file here, or click to select
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                (Only .json files are accepted)
              </p>
            </>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

// Helper functions
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function countItems(data: any): number {
  if (Array.isArray(data)) {
    return data.length;
  } else if (typeof data === 'object' && data !== null) {
    return Object.keys(data).length;
  }
  return 1;
}

function analyzeDataStructure(data: any): any {
  if (Array.isArray(data)) {
    return {
      type: 'array',
      length: data.length,
      sampleItem: data.length > 0 ? analyzeDataStructure(data[0]) : null,
      isHomogeneous: isHomogeneousArray(data)
    };
  } else if (typeof data === 'object' && data !== null) {
    return {
      type: 'object',
      keys: Object.keys(data),
      keyCount: Object.keys(data).length,
      nested: Object.keys(data).reduce((acc, key) => {
        acc[key] = typeof data[key] === 'object' && data[key] !== null
          ? analyzeDataStructure(data[key])
          : { type: typeof data[key] };
        return acc;
      }, {} as Record<string, any>)
    };
  } else {
    return { type: typeof data };
  }
}

function isHomogeneousArray(arr: any[]): boolean {
  if (arr.length <= 1) return true;
  
  const firstType = typeof arr[0];
  return arr.every(item => typeof item === firstType);
}