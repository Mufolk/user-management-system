'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Redoc to avoid SSR issues
const RedocStandalone = dynamic(() => import('redoc').then(mod => mod.RedocStandalone), {
  ssr: false,
  loading: () => <div className="p-4">Loading documentation...</div>
});

export default function DevApiDocs() {
  const [spec, setSpec] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const fetchSpec = async () => {
      try {
        const response = await fetch('/api/docs');
        if (!response.ok) {
          throw new Error('Failed to fetch API documentation');
        }
        const data = await response.json();
        setSpec(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    fetchSpec();
    
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!spec) {
    return (
      <div className="p-4">
        <div className="animate-pulse bg-gray-200 h-screen rounded"></div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <RedocStandalone
        spec={spec}
        options={{
          nativeScrollbars: true,
          theme: {
            colors: {
              primary: {
                main: '#3b82f6',
              },
            },
            typography: {
              fontFamily: 'Inter, system-ui, sans-serif',
              headings: {
                fontFamily: 'Inter, system-ui, sans-serif',
              },
            },
          },
        }}
      />
    </div>
  );
}
