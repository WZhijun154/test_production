import { REPLICATE_API_TOKEN } from '@/utils/replicate/config';

import { NextRequest, NextResponse } from 'next/server';
import { setTaskSession, getSessionId } from '@/utils/replicate/taskSessionMap';

export async function POST(request: NextRequest) {
  try {
    const { replicateInput } = await request.json();
    const replicateResponse = await fetch(
      'https://api.replicate.com/v1/predictions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version:
            '350d32041630ffbe63c8352783a26d94126809164e54085352f8326e53999085',
          input: replicateInput,
          // stop use webhook, because at this time, the server side does not support states
          // webhook: 'https://5a20-180-174-11-18.ngrok-free.app/api/replicate/upscale/webhook', // Replace with your actual webhook URL
          // webhook_events_filter: ['start', 'completed']
        }),
      },
    );

    if (replicateResponse.ok) {
      const prediction = await replicateResponse.json();
      // const taskId = prediction.id;
      // const sessionId = request.cookies.get('session_id')?.value;
      // if (!sessionId) {
      //   return new NextResponse(JSON.stringify({ error: 'Missing session_id cookie' }), {
      //     status: 400,
      //   });
      // }
      // setTaskSession(taskId, sessionId);
      // const test = getSessionId(taskId);
      // console.log('test', test);

      return new NextResponse(JSON.stringify(prediction), { status: 200 });
    } else {
      const error = await replicateResponse.json();
      return new NextResponse(JSON.stringify(error), {
        status: replicateResponse.status,
      });
    }
  } catch (error) {
    console.error('Error in POST:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      {
        status: 500,
      },
    );
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing id parameter' }), {
        status: 400,
      });
    }

    const response = await fetch(
      `https://api.replicate.com/v1/predictions/${id}`,
      {
        headers: {
          Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
        },
      },
    );

    if (response.ok) {
      const prediction = await response.json();
      return new Response(JSON.stringify(prediction), { status: 200 });
    } else {
      const error = await response.json();
      return new Response(JSON.stringify(error), { status: response.status });
    }
  } catch (error) {
    console.error('Error in GET:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
