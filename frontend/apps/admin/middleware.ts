import { runWithAmplifyServerContext } from '@atsumedia/amplify-client';
import { fetchAuthSession } from 'aws-amplify/auth/server';
import { NextRequest, NextResponse } from 'next/server';
import { getSessionInfoByToken } from '@admin/_lib/utils/session-utils';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
	const response = NextResponse.next();
	if (cookies().get('TokenInfo')) {
		return response;
	}
	const authenticated = await runWithAmplifyServerContext({
		nextServerContext: { request, response },
		operation: async (contextSpec) => {
			try {
				const session = await fetchAuthSession(contextSpec);
				if (session.tokens?.accessToken) {
					const authToken = session.tokens?.accessToken?.toString();
					response.cookies.set('Authorization', `Bearer ${authToken}`, { path: '/' });
				}
				if (session.tokens?.idToken) {
					const tokenInfo = getSessionInfoByToken(session.tokens?.idToken!);
					response.cookies.set('TokenInfo', JSON.stringify(tokenInfo), { path: '/' });
				}
				return session.tokens?.accessToken !== undefined && session.tokens?.idToken !== undefined;
			} catch (error) {
				console.log(error);
				return false;
			}
		},
	});

	if (authenticated) {
		return response;
	}
	response.cookies.delete('TokenInfo');

	return NextResponse.redirect(new URL('/sign-in', request.url));
}

export const config = {
	matcher: ['/((?!api|sign-in|_next/static|_next/image|favicon.ico).*)'],
};
