import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/data/products';

interface FittingRoomContextType {
  fittingItems: Product[];
  addFittingItem: (item: Product) => void;
  removeFittingItem: (itemId: number) => void;
}

const FittingRoomContext = createContext<FittingRoomContextType | undefined>(undefined);

export const FittingRoomProvider = ({ children }: { children: ReactNode }) => {
  const [fittingItems, setFittingItems] = useState<Product[]>([]);

  const addFittingItem = (item: Product) => {
    setFittingItems((prevItems) => {
      if (prevItems.find((i) => i.id === item.id)) {
        return prevItems; // Item already exists
      }
      return [...prevItems, item];
    });
  };

  const removeFittingItem = (itemId: number) => {
    setFittingItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  return (
    <FittingRoomContext.Provider value={{ fittingItems, addFittingItem, removeFittingItem }}>
      {children}
    </FittingRoomContext.Provider>
  );
};

export const useFittingRoom = () => {
  const context = useContext(FittingRoomContext);
  if (context === undefined) {
    throw new Error('useFittingRoom must be used within a FittingRoomProvider');
  }
  return context;
};