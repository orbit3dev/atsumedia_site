import { getCategoryByType, CategoryType, News } from '@atsumedia/data';
import { unstable_cache } from 'next/cache';

export const getNewsData = unstable_cache(
	async (slug: string, categoryType?: CategoryType) => {
		const newsList = await getNewsByPathName(slug);

		if (newsList.length == 0) {
			return { newsData: null, paths: [] };
		}
		const news = newsList[0];
		if (categoryType && news.genreType != categoryType) {
			// ニュースのカテゴリとURLのカテゴリが一致しない場合は不正なURLとする
			return { newsData: null, paths: [] };
		}
		const articlesTopPath = { name: 'ニュース', path: '/articles' };
		const genreTypePath = {
			name: getCategoryByType(news.genreType).name,
			path: `/articles/${news.genreType}`,
		};
		const newsPath = { name: news.title };
		const paths = [articlesTopPath, genreTypePath, newsPath];
		return { newsData: news, paths: paths };
	},
	['newsData'],
	{ revalidate: 300 }
);


export const getNewsByPathName = async(slug:string) =>{
	const response = await fetch(
		process.env.NEXT_PUBLIC_API_URL + "/get-news-by-path-name",
		{
			method: "POST",
			body: JSON.stringify({
				slug,
				limit: 1,
				datetime: { lt: new Date().toISOString() },
			}),
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		}
	);
	const dataResult = await response.json();
	const result = Array.isArray(dataResult) ? dataResult : [dataResult];
	return result as News[];
}