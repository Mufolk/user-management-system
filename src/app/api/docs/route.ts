// src/app/api/docs/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { openApiSpec } from '@/lib/openapi';

export async function GET() {
  try {
    // Debug information
    console.log('Environment:', process.env.NODE_ENV);
    
    const headersList = await headers();
    const host = headersList.get('host');
    console.log('Request host:', host);

    // In development, allow all requests
    if (process.env.NODE_ENV !== 'production') {
      console.log('Serving API docs in development mode');
      return new NextResponse(JSON.stringify(openApiSpec), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
        },
      });
    }

    // In production, only allow localhost
    if (host?.includes('localhost') || host?.includes('127.0.0.1')) {
      console.log('Serving API docs in production mode (localhost)');
      return new NextResponse(JSON.stringify(openApiSpec), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
        },
      });
    }

    console.log('Access denied: Not localhost in production');
    return new NextResponse('Not Found', { status: 404 });
  } catch (error) {
    console.error('Error in API docs route:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}