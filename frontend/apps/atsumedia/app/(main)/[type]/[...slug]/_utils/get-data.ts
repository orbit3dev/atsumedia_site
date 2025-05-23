import { Article, CategoryType, getCategoryByType, KeyValue, TagType } from '@atsumedia/data';
import { ArticleSelectionSet } from '../../../type';
// import { reqResBasedClient, runWithAmplifyServerContext } from '@atsumedia/amplify-client';
import { unstable_cache } from 'next/cache';
import { getArticleListByParentIdOrderByClickCount } from '../../../lib';

export const checkParams = (type: CategoryType) => {
	const value = getCategoryByType(type);
	return !!value;
};

export const getResultData = unstable_cache(
	async (params: { type: CategoryType; slug: string[] }) => {
		const value = getCategoryByType(params.type);
		if (!value) {
			return {};
		}

		const pathName = params.slug.join('/');
		const pathNameParent = params.slug.slice(0, -1).join('/');

		// Declare once, assign conditionally
		let parentArticle = null;
		if (pathNameParent) {
			parentArticle = await getArticle(pathNameParent, params.type);
		}

		const article = await getArticle(pathName, params.type);
		if (!article) {
			return { data: null };
		}

		if (article.genreType !== params.type) {
			return { data: null };
		}

		const targetCategory = { key: params.type, value: value.name };
		const { paths: paths1 } = getData1(article, targetCategory);
		return { data: article, paths: paths1, targetCategory, parentData: parentArticle };
	},
	['listByPathName'],
	{ revalidate: 300 }
);


export const getArticle = async (pathName: string, type: string) => {
	const response = await fetch(
		process.env.NEXT_PUBLIC_API_URL + "/detail-article",
		{
			method: "POST",
			body: JSON.stringify({
				path: pathName,
				type: type,
			}),
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		}
	);
	const dataResult = await response.json();
	return dataSort(dataResult[0]);
}

const getData1 = (article: Article, category: KeyValue) => {
	const { key: categoryType, value: categoryName } = category;
	const paths: { name: string; path?: string }[] = [
		{
			name: categoryName,
			path: `/${categoryType}`,
		},
	];
	if (article.tagType == 'root') {
		paths.push({
			name: article.titleMeta,
		});
	} else if (article.tagType == 'series' && article.parent) {
		paths.push({
			name: article.parent.titleMeta,
			path: `/${categoryType}/${article.parent.pathName}`,
		});
		paths.push({
			name: article.titleMeta,
		});
	} else if (article.tagType == 'episode' && article.parent?.parent) {
		paths.push({
			name: article.parent.parent.titleMeta,
			path: `/${categoryType}/${article.parent.parent.pathName}`,
		});
		paths.push({
			name: article.parent.titleMeta,
			path: `/${categoryType}/${article.parent.pathName}`,
		});
		paths.push({
			name: article.titleMeta,
		});
	}
	return { paths };
};

const dataSort = (article: Article): Article => {
	return {
		...article,
		childs: article.childs && article.childs.length > 0 ? article.childs.sort((o1, o2) => o1.sort - o2.sort) : [],
		// vods: article.vods.filter((item) => !!item.vod).sort((o1, o2) => o1.vod!.sort - o2.vod!.sort),
		authors: article.authors.filter((item) => !!item.person).sort((o1, o2) => o1.person!.sort - o2.person!.sort),
		directors: article.directors
			.filter((item) => !!item.person)
			.sort((o1, o2) => o1.person!.sort - o2.person!.sort),
		producers: article.producers
			.filter((item) => !!item.person)
			.sort((o1, o2) => o1.person!.sort - o2.person!.sort),
		screenwriters: article.screenwriters
			.filter((item) => !!item.person)
			.sort((o1, o2) => o1.person!.sort - o2.person!.sort),
		// casts: article.casts.filter((item) => !!item.person).sort((o1, o2) => o1.person!.sort - o2.person!.sort),
		articleOriginalWorks: article.articleOriginalWorks
			.filter((item) => !!item.person)
			.sort((o1, o2) => o1.person!.sort - o2.person!.sort),
		musics: article.musics ? article.musics.sort((o1, o2) => o1.course - o2.course) : [],
	};
};

const getPhotographyOrPopularityDataList = async (data: Article, limit: number) => {
	let articleList: Article[] = [];
	if (data.tagType == TagType.root || data.tagType == TagType.series || data.tagType == TagType.episode) {
		articleList = (await getArticleListByParentIdOrderByClickCount(data.id, limit, data.tagType)).map((item) => {
			return {
				...item.article,
				yearWeek: item.yearWeek,
				clickCount: item.clickCount,
			};
		});
	}

	return articleList;
};

export const getPhotographyOrPopularityDataListBy8 = unstable_cache(
	(data: Article) => {
		return getPhotographyOrPopularityDataList(data, 8);
	},
	['getPhotographyOrPopularityDataListBy8'],
	{ revalidate: 300 }
);
export const getPhotographyOrPopularityDataListBy3 = unstable_cache(
	(data: Article) => {
		return getPhotographyOrPopularityDataList(data, 3);
	},
	['getPhotographyOrPopularityDataListBy3'],
	{ revalidate: 300 }
);
