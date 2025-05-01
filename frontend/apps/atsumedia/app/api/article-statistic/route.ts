import { NextRequest } from 'next/server';
// import { cookieBasedClient } from '../../(main)/_lib/cookieBasedClient';
import { CategoryType } from '@atsumedia/data';

type ResultType = { errors?: any[] };

function getWeekNumber(date = new Date()) {
	const startOfYear = new Date(date.getFullYear(), 0, 1); // 当年的1月1日
	const startOfYearTime = startOfYear.getTime(); // 一年中的1月1日的毫秒数
	const currentDate = date.getTime(); // 当前日期的毫秒数
	const msBetweenDates = currentDate - startOfYearTime; // 当前日期与一年中1月1日的毫秒数差
	return Math.floor(msBetweenDates / (7 * 24 * 60 * 60 * 1000)) + 1;
}

type ArticleStatisticReq = {
	articleId: string;
	genreType: CategoryType;
	tagType: 'root' | 'series' | 'episode';
	parentArticleId: string;
};

type ArticleStatistic = {
	articleId: string;
	yearWeek: number;
	clickCount: number;
	parentArticleIdYearWeek: string;
	genreTypeYearWeekTagType: string;
	yearWeekTagType: string;
};

export async function POST(request: NextRequest) {
	try {
		const rawBody = await request.text(); // Read raw request body as text

		if (!rawBody) {
			throw new Error("Request body is empty");
		}
		// Extract the body data from the request
		const req: ArticleStatisticReq = JSON.parse(rawBody); // Manually parse JSON

		const now = new Date();
		const year = now.getFullYear();
		const week = getWeekNumber(now);
		const yearWeek = parseInt(`${year}${week}`);

		// Send the POST request to the Laravel backend
		const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/article-statistic", {
			method: "POST",
			body: JSON.stringify({
				articleId: req.articleId,
				parentArticleId: (req.parentArticleId == null ? req.tagType : req.parentArticleId),
				genreType: req.genreType,
				tagType: req.tagType,
			}),
			headers: {
				"Content-Type": "application/json", // Ensure JSON is sent
				"Accept": "application/json",
			},
		});

		// Parse the response from the Laravel backend
		const dataResult = await response.json();
		return Response.json({ success: true, data: req });
	} catch (error) {
		return new Response(
			JSON.stringify({ success: false, message: "Invalid JSON input" }),
			{ status: 400, headers: { "Content-Type": "application/json" } }
		);
	}
}
