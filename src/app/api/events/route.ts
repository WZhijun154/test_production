import { NextRequest, NextResponse } from 'next/server';
import { getSessionId, deleteTaskSession } from '@/utils/replicate/taskSessionMap';

const clients: { [key: string]: (data: string) => void } = {};

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('sessionId');

  if (!sessionId) {
    return new NextResponse('Session ID is required', { status: 400 });
  }

  const textEncoder = new TextEncoder();
  const readableStream = new ReadableStream({
    start(controller) {
      clients[sessionId] = (data: string) => {
        controller.enqueue(textEncoder.encode(`data: ${data}\n\n`));
      };

      // Send a comment to keep the connection alive
      controller.enqueue(textEncoder.encode(': keep-alive\n\n'));

      // Keep the connection open
      const keepAliveInterval = setInterval(() => {
        controller.enqueue(textEncoder.encode(': keep-alive\n\n'));
      }, 30000);

      controller.closed.then(() => {
        clearInterval(keepAliveInterval);
        delete clients[sessionId];
      });
    },
  });

  return new NextResponse(readableStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
