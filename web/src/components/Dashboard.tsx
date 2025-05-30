import React from 'react';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';

interface DashboardProps {
  sidebarOpen: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ sidebarOpen }) => {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Sidebar isOpen={sidebarOpen} />
      <MainContent />
    </div>
  );
};