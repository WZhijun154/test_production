import { useEffect, useState } from 'react';

const useSSE = (url: string) => {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      setData(event.data);
    };

    eventSource.onerror = (event) => {
      console.error('EventSource error:', event);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [url]);

  return data;
};

export default useSSE;
