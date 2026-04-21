import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e1e30',
            color: '#f0f0ff',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: 'DM Sans, sans-serif',
          },
          success: { iconTheme: { primary: '#34d399', secondary: '#1e1e30' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#1e1e30' } },
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>
);
