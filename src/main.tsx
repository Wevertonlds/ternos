import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FittingRoomProvider } from './contexts/FittingRoomContext';
import { AuthProvider } from './contexts/AuthContext';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FittingRoomProvider>
          <App />
        </FittingRoomProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);