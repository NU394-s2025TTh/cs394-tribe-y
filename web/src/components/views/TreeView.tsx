import React, { useState } from 'react';
import { useJsonData } from '../../context/JsonDataContext';
import { ChevronRight, ChevronDown, Copy } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TreeNodeProps {
  name: string;
  value: any;
  level: number;
  path: string;
  onCopyPath: (path: string) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ name, value, level, path, onCopyPath }) => {
  const [isOpen, setIsOpen] = useState(level < 2);
  const nodeType = Array.isArray(value) ? 'array' : typeof value;
  const isExpandable = nodeType === 'object' && value !== null;
  const displayName = name || '""';
  const fullPath = path ? `${path}${Array.isArray(value) ? `[${name}]` : `.${name}`}` : name;
  
  const getNodeColor = () => {
    if (nodeType === 'string') return 'text-green-600 dark:text-green-400';
    if (nodeType === 'number') return 'text-blue-600 dark:text-blue-400';
    if (nodeType === 'boolean') return 'text-purple-600 dark:text-purple-400';
    if (nodeType === 'object' && value === null) return 'text-gray-500 dark:text-gray-400';
    return 'text-gray-800 dark:text-white';
  };

  const renderValue = () => {
    if (value === null) return <span className="text-gray-500 dark:text-gray-400">null</span>;
    if (value === undefined) return <span className="text-gray-500 dark:text-gray-400">undefined</span>;
    
    switch (nodeType) {
      case 'string':
        return <span className="text-green-600 dark:text-green-400">"{value}"</span>;
      case 'number':
        return <span className="text-blue-600 dark:text-blue-400">{value}</span>;
      case 'boolean':
        return <span className="text-purple-600 dark:text-purple-400">{String(value)}</span>;
      case 'object':
        return null;
      default:
        return String(value);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="tree-node">
      <div 
        className={cn(
          "flex items-start group",
          isExpandable && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded"
        )}
        onClick={isExpandable ? handleToggle : undefined}
        style={{ marginLeft: `${level * 1.5}rem` }}
      >
        <div className="flex items-center py-1">
          {isExpandable ? (
            isOpen ? (
              <ChevronDown className="h-4 w-4 text-gray-500 mr-1 flex-shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500 mr-1 flex-shrink-0" />
            )
          ) : (
            <span className="w-5"></span>
          )}
          
          <span className={cn("font-mono", getNodeColor())}>
            {Array.isArray(value) ? (
              <>
                <span className="font-semibold">{displayName}</span>
                <span className="text-gray-500 dark:text-gray-400">: </span>
                <span>[{isOpen ? '' : `...`}]</span>
                {!isOpen && <span className="ml-1 text-xs text-gray-500">{value.length} items</span>}
              </>
            ) : typeof value === 'object' && value !== null ? (
              <>
                <span className="font-semibold">{displayName}</span>
                <span className="text-gray-500 dark:text-gray-400">: </span>
                <span>{'{'}{isOpen ? '' : `...`}{'}'}</span>
                {!isOpen && <span className="ml-1 text-xs text-gray-500">{Object.keys(value).length} keys</span>}
              </>
            ) : (
              <>
                <span className="font-semibold">{displayName}</span>
                <span className="text-gray-500 dark:text-gray-400">: </span>
                {renderValue()}
              </>
            )}
          </span>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCopyPath(fullPath);
            }}
            className="ml-2 p-1 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-opacity rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Copy className="h-3 w-3" />
          </button>
        </div>
      </div>

      {isExpandable && isOpen && (
        <div>
          {Array.isArray(value) ? (
            value.map((item, index) => (
              <TreeNode
                key={index}
                name={String(index)}
                value={item}
                level={level + 1}
                path={`${fullPath}`}
                onCopyPath={onCopyPath}
              />
            ))
          ) : (
            Object.entries(value).map(([key, val]) => (
              <TreeNode
                key={key}
                name={key}
                value={val}
                level={level + 1}
                path={fullPath}
                onCopyPath={onCopyPath}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export const TreeView: React.FC = () => {
  const { jsonData } = useJsonData();
  const [jsonPath, setJsonPath] = useState('');
  const [copied, setCopied] = useState(false);

  if (!jsonData) return null;

  const handleCopyPath = (path: string) => {
    setJsonPath(path);
    navigator.clipboard.writeText(path)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy path:', err));
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">JSON Tree View</h2>
        
        <div className="relative flex items-center">
          <input
            type="text"
            value={jsonPath}
            onChange={(e) => setJsonPath(e.target.value)}
            placeholder="JSON path"
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(jsonPath);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="absolute right-2 p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Copy className="h-4 w-4" />
          </button>
          {copied && (
            <span className="absolute -top-8 right-0 text-xs bg-black text-white px-2 py-1 rounded">
              Copied!
            </span>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-auto max-h-[70vh]">
        <TreeNode 
          name="Root" 
          value={jsonData.raw} 
          level={0} 
          path="" 
          onCopyPath={handleCopyPath} 
        />
      </div>
    </div>
  );
};