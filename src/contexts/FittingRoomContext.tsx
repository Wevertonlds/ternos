import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/types';

export interface FittingItem extends Product {
  selectedSize: string;
  fittingId: string; // Unique ID for product-size combo, e.g., "1-M"
}

interface FittingRoomContextType {
  fittingItems: FittingItem[];
  addFittingItem: (item: Product, size: string) => void;
  removeFittingItem: (fittingId: string) => void;
}

const FittingRoomContext = createContext<FittingRoomContextType | undefined>(undefined);

export const FittingRoomProvider = ({ children }: { children: ReactNode }) => {
  const [fittingItems, setFittingItems] = useState<FittingItem[]>([]);

  const addFittingItem = (item: Product, size: string) => {
    const fittingId = `${item.id}-${size}`;
    setFittingItems((prevItems) => {
      if (prevItems.find((i) => i.fittingId === fittingId)) {
        return prevItems; // Item with this size already exists
      }
      const newItem: FittingItem = { ...item, selectedSize: size, fittingId };
      return [...prevItems, newItem];
    });
  };

  const removeFittingItem = (fittingId: string) => {
    setFittingItems((prevItems) => prevItems.filter((item) => item.fittingId !== fittingId));
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