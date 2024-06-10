import { NextRequest, NextResponse } from 'next/server';
import {
  getSessionId,
  deleteTaskSession,
} from '@/utils/replicate/taskSessionMap';
import { clients } from '@/utils/replicate/clients';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('Webhook received', data);
    const clients: { [key: string]: (data: string) => void } = {};

    if (data.status === 'succeeded') {
      const taskId = data.id;

      const upscaledImageUrl = data.output;
      console.log('Upscaled image URL:', upscaledImageUrl);
      const sessionId = getSessionId(taskId);

      if (sessionId) {
        if (clients[sessionId]) {
          clients[sessionId](JSON.stringify({ upscaledImageUrl }));
        }

        deleteTaskSession(taskId);
      }
    }

    return new NextResponse(JSON.stringify({ message: 'Webhook received' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new NextResponse(JSON.stringify({ error: 'Webhook error' }), {
      status: 500,
    });
  }
}
