import React from 'react';
import { useJsonData } from '../context/JsonDataContext';
import { FileType, BarChart3, Table } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { jsonData, currentView, setCurrentView } = useJsonData();
  
  const views = [
    { id: 'overview', name: 'Overview', icon: FileType },
    { id: 'table', name: 'Table View', icon: Table },
    { id: 'charts', name: 'Charts', icon: BarChart3 },
    { id: 'qa', name: 'QA Matching', icon: FileType },
  ];

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-20 h-full w-64 transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out pt-16",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Visualization</h2>
        <nav className="space-y-1">
          {views.map((view) => {
            const Icon = view.icon;
            return (
              <button
                key={view.id}
                onClick={() => setCurrentView(view.id)}
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                  currentView === view.id 
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
                disabled={!jsonData}
              >
                <Icon className="mr-3 h-5 w-5" />
                {view.name}
              </button>
            );
          })}
        </nav>
      </div>
      {jsonData && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">File Information</h3>
          <div className="text-xs text-gray-600 dark:text-gray-300">
            <p><span className="font-medium">Size:</span> {jsonData.metadata?.fileSize}</p>
            <p><span className="font-medium">Items:</span> {jsonData.metadata?.itemCount}</p>
          </div>
        </div>
      )}
    </aside>
  );
};