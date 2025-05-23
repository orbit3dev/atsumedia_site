import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic'; // defaults to auto
import og from 'open-graph';

const getOg = (link: string) => {
	return new Promise((resolve) => {
		og(link, function (_, meta) {
			if (meta) {
				resolve({
					success: 1,
					meta,
				});
			} else {
				resolve({
					success: 0,
					meta: {},
				});
			}
		});
	});
};
export async function GET(request: NextRequest) {
	const link = request.nextUrl.searchParams.get('url');
	if (!link) {
		return Response.json({
			success: 0,
			meta: {},
		});
	}
	const data = await getOg(link);
	return Response.json(data);
}
