import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FittingItem } from './FittingRoomContext';

export type AppointmentStatus = 'Pendente' | 'Finalizado' | 'Cancelado';

export interface Appointment {
  id: number;
  name: string;
  phone: string;
  address: string;
  date: Date;
  fittingItems: FittingItem[];
  status: AppointmentStatus;
}

interface SchedulingContextType {
  appointments: Appointment[];
  blockedDates: Date[];
  addAppointment: (appointmentData: Omit<Appointment, 'id' | 'status'>) => void;
  updateAppointmentStatus: (id: number, status: AppointmentStatus) => void;
  toggleBlockDate: (date: Date) => void;
}

const SchedulingContext = createContext<SchedulingContextType | undefined>(undefined);

// Mock data inicial para visualização
const initialAppointments: Appointment[] = [
  {
    id: 1,
    name: 'João da Silva',
    phone: '(11) 98765-4321',
    address: 'Rua das Flores, 123, São Paulo, SP',
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    fittingItems: [
      { id: 1, name: 'Terno Slim Fit Azul Marinho', brand: 'Alfaiataria Premium', price: 750, imageUrl: 'https://images.unsplash.com/photo-1618307225142-9d4361e5a1a9?q=80&w=1974&auto=format&fit=crop', category: 'Terno', sizes: [], selectedSize: 'M', fittingId: '1-M' },
      { id: 2, name: 'Camisa Social Branca', brand: 'Elegance Wear', price: 180, imageUrl: 'https://images.unsplash.com/photo-1589310243389-66a8b3511aff?q=80&w=1974&auto=format&fit=crop', category: 'Camisa', sizes: [], selectedSize: 'M', fittingId: '2-M' },
    ],
    status: 'Pendente',
  },
  {
    id: 2,
    name: 'Carlos Pereira',
    phone: '(21) 91234-5678',
    address: 'Avenida Copacabana, 456, Rio de Janeiro, RJ',
    date: new Date(new Date().setDate(new Date().getDate() + 5)),
    fittingItems: [
      { id: 4, name: 'Sapato Oxford de Couro', brand: 'Classic Footwear', price: 450, imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop', category: 'Sapato', sizes: [], selectedSize: '41', fittingId: '4-41' },
    ],
    status: 'Pendente',
  },
];

export const SchedulingProvider = ({ children }: { children: ReactNode }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);

  const addAppointment = (appointmentData: Omit<Appointment, 'id' | 'status'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Date.now(),
      status: 'Pendente',
    };
    setAppointments((prev) => [...prev, newAppointment]);
  };

  const updateAppointmentStatus = (id: number, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
  };

  const toggleBlockDate = (date: Date) => {
    setBlockedDates((prev) => {
      const dateString = date.toDateString();
      const isBlocked = prev.some(d => d.toDateString() === dateString);
      if (isBlocked) {
        return prev.filter(d => d.toDateString() !== dateString);
      } else {
        return [...prev, date];
      }
    });
  };

  return (
    <SchedulingContext.Provider value={{ appointments, blockedDates, addAppointment, updateAppointmentStatus, toggleBlockDate }}>
      {children}
    </SchedulingContext.Provider>
  );
};

export const useScheduling = () => {
  const context = useContext(SchedulingContext);
  if (context === undefined) {
    throw new Error('useScheduling must be used within a SchedulingProvider');
  }
  return context;
};