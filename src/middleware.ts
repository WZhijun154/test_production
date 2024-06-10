import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export const middleware = async (req: NextRequest) => {
  const userAgent = req.headers.get('user-agent');
  const isBrowser =
    userAgent &&
    (userAgent.includes('Mozilla') ||
      userAgent.includes('Chrome') ||
      userAgent.includes('Safari') ||
      userAgent.includes('Firefox') ||
      userAgent.includes('Edge'));

  if (!isBrowser) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  // const session = await getIronSession<IronSessionData>(
  //   req,
  //   res,
  //   sessionOptions,
  // );

  // if (!session.id) {
  //   session.id = uuidv4();
  //   await session.save();
  // } else {

  // }
  // const setCookieHeader = res.headers.get('Set-Cookie');
  // if (setCookieHeader) {

  // } else {

  // }
  const existingSessionId = req.cookies.get('session-id');
  if (!existingSessionId) {
    res.cookies.set('session-id', uuidv4(), {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      httpOnly: true,
    });

    console.log('Cookie set in the response');
  } else {
    console.log('Existing cookie found:', existingSessionId);
  }

  return res;
};

export const config = {
  matcher: ['/:path*'], // Apply middleware to all paths
};
