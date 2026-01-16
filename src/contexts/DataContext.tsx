
import React, { createContext, useContext } from 'react';
import { useFirestore as useDataStore, AppData } from '../hooks/useFirestore';

interface DataContextType {
  data: AppData | null;
  saveData: (newData: AppData) => Promise<void>;
  isInitialized: boolean;
  addDocument: (collectionName: string, item: any) => Promise<string>;
  updateDocument: (collectionName: string, id: string, updates: any) => Promise<void>;
  deleteDocument: (collectionName: string, id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useDataStore();
  return <DataContext.Provider value={store}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};