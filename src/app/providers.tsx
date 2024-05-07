'use client';
import { Provider as AtomProvider } from 'jotai';
import { useRouter } from 'next/navigation';
import { NextUIProvider } from '@nextui-org/react';
import React, { ReactNode } from 'react';

// create a provider component
const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  return (
    <AtomProvider>
      {/* <NextUIProvider navigate={router.push}> */}
      {children}
      {/* </NextUIProvider> */}
    </AtomProvider>
  );
};

export default Providers;
