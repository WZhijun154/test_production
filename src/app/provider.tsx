import { Provider as AtomProvider } from 'jotai';
import React, { ReactNode } from 'react';

// create a provider component
const Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <AtomProvider>{children}</AtomProvider>;
};

export default Provider;
