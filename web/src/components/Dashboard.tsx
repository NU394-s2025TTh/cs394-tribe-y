import React from 'react';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { useJsonData } from '../context/JsonDataContext';

interface DashboardProps {
  sidebarOpen: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ sidebarOpen }) => {
  const { jsonData } = useJsonData();

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {jsonData && <Sidebar isOpen={sidebarOpen} />}
      <MainContent />
    </div>
  );
};
