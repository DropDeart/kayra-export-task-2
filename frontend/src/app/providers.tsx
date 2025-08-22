'use client';

import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store/store';
import React from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <SessionProvider>
        {children}
        <ToastContainer />
      </SessionProvider>
    </ReduxProvider>
  );
}