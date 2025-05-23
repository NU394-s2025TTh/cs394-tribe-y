import React, { createContext, useContext, useState } from 'react';

export interface JsonMetadata {
  fileName: string;
  fileSize: string;
  itemCount: number;
  dateUploaded: string;
}

export interface JsonDataStructure {
  type: string;
  [key: string]: any;
}

export interface ProcessedJsonData {
  raw: any;
  metadata?: JsonMetadata;
  structure?: JsonDataStructure;
}

interface JsonDataContextType {
  jsonData: ProcessedJsonData | null;
  setJsonData: React.Dispatch<React.SetStateAction<ProcessedJsonData | null>>;
  currentView: string;
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const JsonDataContext = createContext<JsonDataContextType | undefined>(undefined);

export const JsonDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jsonData, setJsonData] = useState<ProcessedJsonData | null>(null);
  const [currentView, setCurrentView] = useState('overview');
  const [error, setError] = useState<string | null>(null);

  return (
    <JsonDataContext.Provider value={{ 
      jsonData, 
      setJsonData, 
      currentView, 
      setCurrentView,
      error,
      setError
    }}>
      {children}
    </JsonDataContext.Provider>
  );
};

export const useJsonData = () => {
  const context = useContext(JsonDataContext);
  if (context === undefined) {
    throw new Error('useJsonData must be used within a JsonDataProvider');
  }
  return context;
};