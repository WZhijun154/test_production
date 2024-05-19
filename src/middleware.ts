// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session'
import { sessionOptions, IronSessionData } from '@/lib/session';
import { v4 as uuidv4} from 'uuid'

export const middleware = async (req: NextRequest) => {
  const userAgent = req.headers.get('user-agent');
    // Simple check to determine if the request is from a browser
  const isBrowser = userAgent && (
      userAgent.includes('Mozilla') ||
      userAgent.includes('Chrome') ||
      userAgent.includes('Safari') ||
      userAgent.includes('Firefox') ||
      userAgent.includes('Edge')
    );

  if (!isBrowser) {
    // Skip session handling for non-browser requests
    return NextResponse.next();
  }


  const res = NextResponse.next();
  const session = await getIronSession<IronSessionData>(req, res, sessionOptions)

  if (!session.id) {
    session.id = uuidv4();
    await session.save();
  }

  return res;
};

export const config = {
  matcher: ['/:path*'], // Apply middleware to all paths
}

