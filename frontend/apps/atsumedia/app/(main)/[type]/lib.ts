import {
	ArticleSelectionSet,
	BannerSelectionSet,
	PersonSelectionSet,
	TopicArticleSelectionSet,
	TopicSelectionSet,
} from '../type';
import { Article, PageSetting, Person, TagType, CategoryType } from '@atsumedia/data';
// import { reqResBasedClient, runWithAmplifyServerContext } from '@atsumedia/amplify-client';
import { unstable_cache } from 'next/cache';


// export const getCategoryRootList = unstable_cache(
// 	async (data: Article, limit: number, categoryType: CategoryType) => {
// 		return runWithAmplifyServerContext({
// 			nextServerContext: null,
// 			operation: async (contextSpec) => {
// 				const params = {
// 					selectionSet: ArticleSelectionSet,
// 					categoryId: data.categoryId,
// 					genreTypeTagTypeSort: {
// 						beginsWith: {
// 							genreType: categoryType,
// 							tagType: TagType.root,
// 						},
// 					},
// 					limit,
// 				};
// 				const categoryRootDBResult = await reqResBasedClient.models.Article.listByCategoryIdAndTypeSort(
// 					contextSpec,
// 					// @ts-ignore
// 					params
// 				);
// 				console.log('getCategoryRootList')
// 				// @ts-ignore
// 				return (categoryRootDBResult.data ?? []) as Article[];
// 			},
// 		});
// 	},
// 	['getCategoryRootList'],
// 	{ revalidate: 300 }
// );

// export const getSeriesList = unstable_cache(
// 	async (pathName: string, limit: number) => {
// 		return runWithAmplifyServerContext({
// 			nextServerContext: null,
// 			operation: async (contextSpec) => {
// 				const params = {
// 					selectionSet: ArticleSelectionSet,
// 					tagType: TagType.series,
// 					pathNameSort: {
// 						beginsWith: {
// 							pathName,
// 						},
// 					},
// 					limit,
// 				};
// 				const seriesDBResult = await reqResBasedClient.models.Article.listByTagTypeAndPathNameAndSort(
// 					contextSpec,
// 					// @ts-ignore
// 					params
// 				);
// 				console.log('getSeriesList')
// 				// @ts-ignore
// 				return (seriesDBResult.data ?? []) as Article[];
// 			},
// 		});
// 	},
// 	['getSeriesList'],
// 	{ revalidate: 300 }
// );

// export const getCategorySeriesList = unstable_cache(
// 	async (data: Article, limit: number) => {
// 		return runWithAmplifyServerContext({
// 			nextServerContext: null,
// 			operation: async (contextSpec) => {
// 				const params = {
// 					selectionSet: ArticleSelectionSet,
// 					categoryId: data.categoryId,
// 					genreTypeTagTypeSort: {
// 						beginsWith: {
// 							genreType: data.genreType,
// 							tagType: TagType.series,
// 						},
// 					},
// 					limit,
// 				};
// 				const categorySeriesDBResult = await reqResBasedClient.models.Article.listByCategoryIdAndTypeSort(
// 					contextSpec,
// 					// @ts-ignore
// 					params
// 				);
// 				console.log('getCategorySeriesList')
// 				// @ts-ignore
// 				return (categorySeriesDBResult.data ?? []) as Article[];
// 			},
// 		});
// 	},
// 	['getCategorySeriesList'],
// 	{ revalidate: 300 }
// );

// export const getEpisodeList = unstable_cache(
// 	async (pathName: string, limit: number) => {
// 		return runWithAmplifyServerContext({
// 			nextServerContext: null,
// 			operation: async (contextSpec) => {
// 				const params = {
// 					selectionSet: ArticleSelectionSet,
// 					tagType: TagType.episode,
// 					pathNameSort: {
// 						beginsWith: {
// 							pathName,
// 						},
// 					},
// 					limit,
// 				};
// 				// @ts-ignore
// 				const episodeDBResult = await reqResBasedClient.models.Article.listByTagTypeAndPathNameAndSort(
// 					contextSpec,
// 					// @ts-ignore
// 					params
// 				);
// 				console.log('getEpisodeList')
// 				// @ts-ignore
// 				return (episodeDBResult.data ?? []) as Article[];
// 			},
// 		});
// 	},
// 	['getEpisodeList'],
// 	{ revalidate: 300 }
// );

// export const getOtherEpisodeList = unstable_cache(
// 	async (data: Article, limit: number) => {
// 		return runWithAmplifyServerContext({
// 			nextServerContext: null,
// 			operation: async (contextSpec) => {
// 				const params = {
// 					selectionSet: ArticleSelectionSet,
// 					tagType: TagType.episode,
// 					pathNameSort: {
// 						beginsWith: {
// 							pathName: data.parent?.parent?.pathName,
// 						},
// 					},
// 					limit,
// 				};
// 				// @ts-ignore
// 				const otherEpisodeDBResult = await reqResBasedClient.models.Article.listByTagTypeAndPathNameAndSort(
// 					contextSpec,
// 					// @ts-ignore
// 					params
// 				);
// 				console.log('getOtherEpisodeList')
// 				// @ts-ignore
// 				return (otherEpisodeDBResult.data ?? []) as Article[];
// 			},
// 		});
// 	},
// 	['getOtherEpisodeList'],
// 	{ revalidate: 300 }
// );

export const getPersonList = async () => {
	const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/get-person-ten", { method: "GET" });
	const dataResult = await response.json()
	return dataResult;
};

export const getTopicData = async () => {
	//v1
	const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/get-banner",
		{
			method: "POST",
			body: JSON.stringify({ type: 'topic' }),
			headers: {
				"Content-Type": "application/json", // Ensure JSON is sent
				"Accept": "application/json",
			},
		});
	const dataResult = await response.json()
	return dataResult;
};



export const getBannerList = async () => {
	//v1
	const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/get-banner",
		{
			method: "POST",
			body: JSON.stringify({ type: 'banner' }),
			headers: {
				"Content-Type": "application/json", // Ensure JSON is sent
				"Accept": "application/json",
			},
		});

	const dataResult = await response.json()
	return dataResult;
};

// export const getTopList = unstable_cache(
// 	async (limit: number) => {
// 		return runWithAmplifyServerContext({
// 			nextServerContext: null,
// 			operation: async (contextSpec) => {
// 				const params = {
// 					selectionSet: TopicArticleSelectionSet,
// 					parentId: 'root',
// 					limit,
// 				};
// 				// @ts-ignore
// 				const dbResult10 = await reqResBasedClient.models.Article.listByParentIdAndSort(contextSpec, params);
// 				// @ts-ignore
// 				return (dbResult10.data ?? []) as Article[];
// 			},
// 		});
// 	},
// 	['getTopList'],
// 	{ revalidate: 300 }
// );


export const getNewList = async (
	seasonId: string,
	// genreTypeId: number,
	// tagTypeId: number
) => {
	const response = await fetch(
		process.env.NEXT_PUBLIC_API_URL + "/list-by-season-id",
		{
			method: "POST",
			body: JSON.stringify({
				season_id: '21',
				genre_type_id: 1,
				tag_type_id: 2,
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

