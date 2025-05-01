
import { Article, ArticleStatistic, CategoryType, News, PageSetting, Person, TagType } from '@atsumedia/data';
import { unstable_cache } from 'next/cache';


export const getPersonList = async () => {
	const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/get-person", { method: "GET" });
	const dataResult = await response.json()
	return dataResult;
};



export const getBannerList = async (data: string) => {
	const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/get-banner",
		{
			method: "POST",
			body: JSON.stringify({ type: 'banner', category: data }),
			headers: {
				"Content-Type": "application/json", // Ensure JSON is sent
				"Accept": "application/json",
			},
		});
	const dataResult = await response.json()
	return dataResult;
};



export const getTopicData = async (data: string) => {
	const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/get-banner",
		{
			method: "POST",
			body: JSON.stringify({ type: 'topic', category: data }),
			headers: {
				"Content-Type": "application/json", // Ensure JSON is sent
				"Accept": "application/json",
			},
		});
	const dataResult = await response.json()
	return dataResult;
};

// export const listByParentIdAndSort = unstable_cache(
// 	async () => {
// 		return runWithAmplifyServerContext({
// 			nextServerContext: null,
// 			operation: async (contextSpec) => {
// 				const params = {
// 					selectionSet: TopicArticleSelectionSet,
// 					parentId: 'root',
// 					limit: 10,
// 				};
// 				// @ts-ignore
// 				const dbResult10 = await reqResBasedClient.models.Article.listByParentIdAndSort(contextSpec, params);
// 				// @ts-ignore
// 				return (dbResult10.data ?? []) as Article[];
// 			},
// 		});
// 	},
// 	['listByParentIdAndSort'],
// 	{ revalidate: 300 }
// );

export function getWeekNumber(date = new Date()) {
	const startOfYear = new Date(date.getFullYear(), 0, 1); // 当年的1月1日
	const startOfYearTime = startOfYear.getTime(); // 一年中的1月1日的毫秒数
	const currentDate = date.getTime(); // 当前日期的毫秒数
	const msBetweenDates = currentDate - startOfYearTime; // 当前日期与一年中1月1日的毫秒数差
	return Math.floor(msBetweenDates / (7 * 24 * 60 * 60 * 1000)) + 1;
}

export const getArticleListOrderByClickCount = async (
	seasonId: TagType,
	// genreTypeId: number,
	// tagTypeId: number
) => {
	const response = await fetch(
		process.env.NEXT_PUBLIC_API_URL + "/list-by-genre",
		{
			method: "POST",
			body: JSON.stringify({
				season_id: '21',
				genre_type_id: 1,
				tag_type_id: 2,
				// genre_type_year_week_tag_type : '2025'
			}),
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		}
	);
	const dataResult = await response.json();
	return dataResult;
};



export const getRootArticleListByGenreTypeOrderByClickCount = async (
	// genreTypeYearWeekTagType: string
	genreType: CategoryType,
	limit: number,
	tagType: TagType
) => {
	const response = await fetch(
		process.env.NEXT_PUBLIC_API_URL + "/list-by-genre",
		{
			method: "POST",
			body: JSON.stringify({
				genre_type_year_week_tag_type: 'genreTypeYearWeekTagType',
				genre_type: genreType,
			}),
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		}
	);
	const dataResult = await response.json();
	return dataResult;
};

export const getArticleListByParentIdOrderByClickCount = async (
	parentId: string,
	limit: number,
	tag_type: string,
) => {
	const now = new Date();
	const weekNumber = getWeekNumber(now);
	const response = await fetch(
		process.env.NEXT_PUBLIC_API_URL + "/get-article-statistic-by-count-click",
		{
			method: "POST",
			body: JSON.stringify({
				parent_id: parentId,
				parentArticleIdYearWeek: `${parentId}-${now.getFullYear()}${weekNumber}`,
				YearWeek: `${parentId}-${now.getFullYear()}${weekNumber}`,
				limit: limit,
				sortDirection: 'DESC',
				tagType:tag_type
			}),
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		}
	);

	const dataResult2 = await response.json();
	let list = (dataResult2 ?? []) as ArticleStatistic[];
	return list;
};




export const getNewsListByGenreType = async (
	genreType: string,
	limit: number
) => {
	const response = await fetch(
		process.env.NEXT_PUBLIC_API_URL + "/news-list-by-genre",
		{
			method: "POST",
			body: JSON.stringify({
				genre_type: genreType,
				limit: limit,
			}),
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		}
	);

	const dataResult = await response.json();
	return dataResult;
};




export const getIsTopNewsList = async (category: string, data: number) => {
	const response = await fetch(
		process.env.NEXT_PUBLIC_API_URL + "/news-list-by-genre",
		{
			method: "POST",
			body: JSON.stringify({
				season_id: '21',
				genre_type_id: 1,
				tag_type_id: 2,
				is_top: 1,
				category: category,
			}),
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		}
	);
	const dataResult = await response.json();
	return dataResult;
}
