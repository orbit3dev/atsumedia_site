import { NewsListSelectionSet, NewsSelectionSet } from '../../(main)/type';
import { reqResBasedClient, runWithAmplifyServerContext } from '@atsumedia/amplify-client';
import { News } from '@atsumedia/data';
import { articlePath } from '../../_lib/config';
import { unstable_cache } from 'next/cache';

export const getPathFromNewsData = (data: News) => {
	return `/${articlePath}/${data.genreType}/${data.pathName}`;
};

export const getRssNewsList = unstable_cache(
	async (limit: number) => {
		return runWithAmplifyServerContext({
			nextServerContext: null,
			operation: async (contextSpec) => {
				const params = {
					selectionSet: NewsListSelectionSet,
					topPublic: '1-1',
					limit,
					sortDirection: 'DESC',
					datetime: { lt: new Date().toISOString() },
				};
				// @ts-ignore
				const dbResult = await reqResBasedClient.models.News.listByTopAndTopPublic(contextSpec, params);
				// @ts-ignore
				return (dbResult.data ?? []) as News[];
			},
		});
	},
	['rssNewsList'],
	{ revalidate: 60 }
);

export const getNewsByPathName = unstable_cache(
	async (pathName: string) => {
		return runWithAmplifyServerContext({
			nextServerContext: null,
			operation: async (contextSpec) => {
				const params = {
					selectionSet: NewsSelectionSet,
					pathName,
					limit: 1,
					datetime: { lt: new Date().toISOString() },
				};
				// @ts-ignore
				const dbResult = await reqResBasedClient.models.News.newListByPathName(contextSpec, params);
				// @ts-ignore
				return (dbResult.data ?? []) as News[];
			},
		});
	},
	['rssNewsDetails'],
	{ revalidate: 300 }
);
