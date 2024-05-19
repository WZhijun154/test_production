import { REPLICATE_API_TOKEN } from '@/utils/replicate/config';

export async function POST(request: Request) {
  const { replicateInput } = await request.json();
  console.log('Prompt:', prompt);
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version:
        '2b017d9b67edd2ee1401238df49d75da53c523f36e363881e057f5dc3ed3c5b2',
      input: { replicateInput },
    }),
  });

  if (response.ok) {
    const prediction = await response.json();
    return new Response(JSON.stringify(prediction), { status: 200 });
  } else {
    const error = await response.json();
    return new Response(JSON.stringify(error), { status: response.status });
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
            'Content-Type': 'application/json',
          },
        }
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