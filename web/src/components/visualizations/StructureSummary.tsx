import React from 'react';
import { Database, ListTree, Braces, Hash, Type, Text, AlertCircle } from 'lucide-react';

interface StructureSummaryProps {
  structure: any;
}

export const StructureSummary: React.FC<StructureSummaryProps> = ({ structure }) => {
  if (!structure) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'array':
        return <ListTree className="w-5 h-5 text-blue-500" />;
      case 'object':
        return <Braces className="w-5 h-5 text-purple-500" />;
      case 'number':
        return <Hash className="w-5 h-5 text-green-500" />;
      case 'string':
        return <Text className="w-5 h-5 text-orange-500" />;
      case 'boolean':
        return <Type className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const renderStructureSummary = () => {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Database className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <h3 className="font-medium text-gray-800 dark:text-white">Root Structure</h3>
        </div>
        
        <div className="ml-6">
          <div className="flex items-center gap-2">
            {getTypeIcon(structure.type)}
            <span className="text-gray-800 dark:text-white font-medium capitalize">{structure.type}</span>
          </div>
          
          {structure.type === 'array' && (
            <div className="ml-6 mt-2 space-y-2">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span className="w-32">Items:</span>
                <span className="font-medium">{structure.length}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span className="w-32">Homogeneous:</span>
                <span className="font-medium">{structure.isHomogeneous ? 'Yes' : 'No'}</span>
              </div>
              {structure.sampleItem && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sample item type:</p>
                  <div className="ml-2 mt-1">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(structure.sampleItem.type)}
                      <span className="text-gray-800 dark:text-white font-medium capitalize">{structure.sampleItem.type}</span>
                    </div>
                    
                    {structure.sampleItem.type === 'object' && (
                      <div className="ml-6 mt-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Properties:</p>
                        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                          {structure.sampleItem.keys.map((key: string) => (
                            <li key={key} className="ml-2">{key}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {structure.type === 'object' && (
            <div className="ml-6 mt-2 space-y-2">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span className="w-32">Properties:</span>
                <span className="font-medium">{structure.keyCount}</span>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Key structure:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {Object.entries(structure.nested).map(([key, value]: [string, any]) => (
                    <div key={key} className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-800 dark:text-white font-medium">{key}</span>
                        <div className="flex items-center gap-1">
                          {getTypeIcon(value.type)}
                          <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{value.type}</span>
                        </div>
                      </div>
                      
                      {value.type === 'object' && (
                        <div className="mt-1 pl-4 text-xs text-gray-500 dark:text-gray-400 border-l-2 border-gray-200 dark:border-gray-700">
                          <p>{value.keyCount} properties</p>
                          {value.keyCount <= 3 && value.keys && (
                            <p className="truncate">{value.keys.join(', ')}</p>
                          )}
                        </div>
                      )}
                      
                      {value.type === 'array' && (
                        <div className="mt-1 pl-4 text-xs text-gray-500 dark:text-gray-400 border-l-2 border-gray-200 dark:border-gray-700">
                          <p>{value.length} items</p>
                          <p>Homogeneous: {value.isHomogeneous ? 'Yes' : 'No'}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return renderStructureSummary();
};