
import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Transaction {
  id: string;
  description: string;
  timestamp: Date;
  status: 'Pending' | 'Confirmed' | 'Failed';
}

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  transactions: Transaction[];
  connectWallet: () => void;
  disconnectWallet: () => void;
  addTransaction: (description: string) => void;
}

export const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const connectWallet = () => {
    // This is a mock connection
    const mockAddress = '0x' + [...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    setAddress(mockAddress);
    setIsConnected(true);
    // In a real app, you would use thirdweb SDK here.
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
  };

  const addTransaction = (description: string) => {
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      description,
      timestamp: new Date(),
      status: 'Pending',
    };
    
    setTransactions(prev => [newTx, ...prev]);

    // Simulate confirmation delay
    setTimeout(() => {
        setTransactions(prev => prev.map(tx => 
            tx.id === newTx.id ? { ...tx, status: 'Confirmed' } : tx
        ));
    }, 2000 + Math.random() * 2000); // 2-4 seconds delay
  };

  return (
    <WalletContext.Provider value={{ isConnected, address, transactions, connectWallet, disconnectWallet, addTransaction }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
