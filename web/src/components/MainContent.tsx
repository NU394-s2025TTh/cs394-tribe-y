import React from 'react';
import { useJsonData } from '../context/JsonDataContext';
import { FileUploader } from './FileUploader';
import { OverviewView } from './views/OverviewView';
import { TableView } from './views/TableView';
import { ChartView } from './views/ChartView';
import { TreeView } from './views/TreeView';

export const MainContent: React.FC = () => {
  const { jsonData, currentView } = useJsonData();

  const renderContent = () => {
    if (!jsonData) {
      return <FileUploader />;
    }

    switch (currentView) {
      case 'overview':
        return <OverviewView />;
      case 'table':
        return <TableView />;
      case 'charts':
        return <ChartView />;
      case 'tree':
        return <TreeView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <main className="flex-1 overflow-auto p-6 ml-0 transition-all duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto">
        {renderContent()}
      </div>
    </main>
  );
};