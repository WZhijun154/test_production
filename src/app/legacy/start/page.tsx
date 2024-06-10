'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/landing');
  }, [router]);

  return null;
};

export default Home;