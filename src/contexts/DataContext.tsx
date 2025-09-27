'use client';
import React, { createContext, useContext } from 'react';
import { useDataStore, AppData } from '../hooks/useDataStore';

interface DataContextType {
  data: AppData | null;
  saveData: (newData: AppData) => void;
  isInitialized: boolean;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode; initialData: AppData | null }> = ({ children, initialData }) => {
  const store = useDataStore(initialData);
  return <DataContext.Provider value={store}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};