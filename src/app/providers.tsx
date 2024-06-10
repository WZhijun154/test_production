'use client';
import { Provider as AtomProvider } from 'jotai';
import { useRouter } from 'next/navigation';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import React, { ReactNode } from 'react';

// create a provider component
const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  return (
    <AtomProvider>
      <NextUIProvider navigate={router.push}>
        <NextThemesProvider attribute='class' defaultTheme='dark'>
          <main className='dark text-foreground bg-background'>{children}</main>
        </NextThemesProvider>
      </NextUIProvider>
    </AtomProvider>
  );
};

export default Providers;
