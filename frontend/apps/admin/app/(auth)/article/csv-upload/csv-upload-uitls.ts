import {
	ArticleCast,
	ArticleCsvItem,
	ArticleItem,
	ArticlePerson,
	ArticleProduction,
	ArticleVod,
} from '@admin/(auth)/article/csv-upload/modal';
import { dataPartitioning, handleTask } from '@admin/_lib/utils/csv-upload-data';
import { getTableName, userPoolClient } from '@atsumedia/amplify-client';
import { CsvUploadStatistic, CsvUploadStatus, TableName, CategoryType } from '@atsumedia/data';
import { UploadProps } from '@admin/(auth)/_components/csv-upload-provider';

export const handleUpload = async (props: UploadProps<ArticleCsvItem>) => {
	const { data: csvDataArray, genreType, setStatus } = props;
	setStatus({ status: CsvUploadStatus.prepare, statistics: [] });
	const articleProductionArray: ArticleProduction[] = [];
	const articleVodArray: ArticleVod[] = [];
	const articleCastArray: ArticleCast[] = [];
	const articleAuthorArray: ArticlePerson[] = [];
	const articleDirectorArray: ArticlePerson[] = [];
	const articleProducerArray: ArticlePerson[] = [];
	const articleScreenwriterArray: ArticlePerson[] = [];
	const articleOriginalWorkArray: ArticlePerson[] = [];
	const parentIdMap: Map<string, string> = new Map();
	for (const articleCsvItem of csvDataArray) {
		articleProductionArray.push(...convertArticleProduction(articleCsvItem));
		articleVodArray.push(...convertArticleVodArray(articleCsvItem));
		articleCastArray.push(...convertArticleCastArray(articleCsvItem));
		const articlePerson = convertArticlePersonArray(articleCsvItem);
		articleAuthorArray.push(...articlePerson.articleAuthorArray);
		articleDirectorArray.push(...articlePerson.articleDirectorArray);
		articleProducerArray.push(...articlePerson.articleProducerArray);
		articleScreenwriterArray.push(...articlePerson.articleScreenwriterArray);
		articleOriginalWorkArray.push(...articlePerson.articleOriginalWorkArray);
		const tagType = getTagType(articleCsvItem);
		if (tagType == 'root') {
			parentIdMap.set(articleCsvItem.title_path, articleCsvItem.id);
		} else if (tagType == 'series') {
			parentIdMap.set(articleCsvItem.title_path + '/' + articleCsvItem.series_path, articleCsvItem.id);
		}
	}
	const articleItemArray = csvDataArray.map((item) => convertArticleItem(item, parentIdMap, genreType));
	// console.log(articleItemArray);
	// console.log(articleVodArray);
	// console.log(articleCastArray);
	// console.log(articleAuthorArray);
	// console.log(articleDirectorArray);
	// console.log(articleProducerArray);
	// console.log(articleScreenwriterArray);
	// console.log(articleOriginalWorkArray);

	const articleItemTaskList = dataPartitioning(
		articleItemArray,
		(items) =>
			userPoolClient.mutations.putArticle({
				table: getTableName(TableName.Article),
				body: JSON.stringify(items),
			}),
		TableName.Article
	);

	const articleProductionTaskList = dataPartitioning(
		articleProductionArray,
		(items) =>
			userPoolClient.mutations.putArticleProduction({
				table: getTableName(TableName.ArticleProduction),
				body: JSON.stringify(items),
			}),
		TableName.ArticleProduction
	);

	const articleVodTaskList = dataPartitioning(
		articleVodArray,
		(items) =>
			userPoolClient.mutations.putArticleVod({
				table: getTableName(TableName.ArticleVod),
				body: JSON.stringify(items),
			}),
		TableName.ArticleVod
	);

	const articleCastTaskList = dataPartitioning(
		articleCastArray,
		(items) =>
			userPoolClient.mutations.putArticleCast({
				table: getTableName(TableName.ArticleCast),
				body: JSON.stringify(items),
			}),
		TableName.ArticleCast
	);

	const articleAuthorTaskList = dataPartitioning(
		articleAuthorArray,
		(items) =>
			userPoolClient.mutations.putArticleAuthor({
				table: getTableName(TableName.ArticleAuthor),
				body: JSON.stringify(items),
			}),
		TableName.ArticleAuthor
	);

	const articleDirectorTaskList = dataPartitioning(
		articleDirectorArray,
		(items) =>
			userPoolClient.mutations.putArticleDirector({
				table: getTableName(TableName.ArticleDirector),
				body: JSON.stringify(items),
			}),
		TableName.ArticleDirector
	);

	const articleProducerTaskList = dataPartitioning(
		articleProducerArray,
		(items) =>
			userPoolClient.mutations.putArticleProducer({
				table: getTableName(TableName.ArticleProducer),
				body: JSON.stringify(items),
			}),
		TableName.ArticleProducer
	);

	const articleScreenwriterTaskList = dataPartitioning(
		articleScreenwriterArray,
		(items) =>
			userPoolClient.mutations.putArticleScreenwriter({
				table: getTableName(TableName.ArticleScreenwriter),
				body: JSON.stringify(items),
			}),
		TableName.ArticleScreenwriter
	);

	const articleOriginalWorkTaskList = dataPartitioning(
		articleOriginalWorkArray,
		(items) =>
			userPoolClient.mutations.putArticleOriginalWork({
				table: getTableName(TableName.ArticleOriginalWork),
				body: JSON.stringify(items),
			}),
		TableName.ArticleOriginalWork
	);
	const statistics: CsvUploadStatistic[] = [
		{
			tableName: TableName.ArticleProduction,
			total: articleProductionArray.length,
			successCount: 0,
			errorCount: 0,
			error: [],
		},
		{ tableName: TableName.ArticleVod, total: articleVodArray.length, successCount: 0, errorCount: 0, error: [] },
		{ tableName: TableName.ArticleCast, total: articleCastArray.length, successCount: 0, errorCount: 0, error: [] },
		{
			tableName: TableName.ArticleAuthor,
			total: articleAuthorArray.length,
			successCount: 0,
			errorCount: 0,
			error: [],
		},
		{
			tableName: TableName.ArticleDirector,
			total: articleDirectorArray.length,
			successCount: 0,
			errorCount: 0,
			error: [],
		},
		{
			tableName: TableName.ArticleProducer,
			total: articleProducerArray.length,
			successCount: 0,
			errorCount: 0,
			error: [],
		},
		{
			tableName: TableName.ArticleScreenwriter,
			total: articleScreenwriterArray.length,
			successCount: 0,
			errorCount: 0,
			error: [],
		},
		{
			tableName: TableName.ArticleOriginalWork,
			total: articleOriginalWorkArray.length,
			successCount: 0,
			errorCount: 0,
			error: [],
		},
		{ tableName: TableName.Article, total: articleItemArray.length, successCount: 0, errorCount: 0, error: [] },
	];
	setStatus({
		status: CsvUploadStatus.start,
		statistics,
	});
	const taskList = [
		articleItemTaskList,
		articleProductionTaskList,
		articleVodTaskList,
		articleAuthorTaskList,
		articleDirectorTaskList,
		articleProducerTaskList,
		articleScreenwriterTaskList,
		articleCastTaskList,
		articleOriginalWorkTaskList,
	];
	taskList.sort((o1, o2) => o1.length - o2.length);
	await handleTask(
		taskList.flatMap((item) => item),
		setStatus
	);
	setStatus({
		status: CsvUploadStatus.finish,
	});
};

function getTagType(articleCsvItem: ArticleCsvItem): 'root' | 'series' | 'episode' {
	return articleCsvItem.episode_path ? 'episode' : articleCsvItem.series_path ? 'series' : 'root';
}

function getPathName(tagType: 'root' | 'series' | 'episode', articleCsvItem: ArticleCsvItem): string {
	switch (tagType) {
		case 'root':
			return articleCsvItem.title_path;
		case 'series':
			return articleCsvItem.title_path + '/' + articleCsvItem.series_path;
		case 'episode':
			return articleCsvItem.title_path + '/' + articleCsvItem.series_path + '/' + articleCsvItem.episode_path;
		default:
			return '';
	}
}

function getParentId(
	articleCsvItem: ArticleCsvItem,
	tagType: 'root' | 'series' | 'episode',
	parentIdMap: Map<string, string>
): string | undefined {
	switch (tagType) {
		case 'series':
			return parentIdMap.get(articleCsvItem.title_path);
		case 'episode':
			return parentIdMap.get(articleCsvItem.title_path + '/' + articleCsvItem.series_path);
		case 'root':
			return 'root';
		default:
			return undefined;
	}
}

function convertSns(articleCsvItem: ArticleCsvItem): string[] {
	const sns: string[] = [];
	for (let i = 1; i <= 3; i++) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		if (articleCsvItem['sns_' + i]) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			sns.push(articleCsvItem['sns_' + i]);
		}
	}
	return sns;
}

function convertArticleItem(
	articleCsvItem: ArticleCsvItem,
	parentIdMap: Map<string, string>,
	genreType: CategoryType,
): ArticleItem {
	const tagType = getTagType(articleCsvItem);
	const pathName = getPathName(tagType, articleCsvItem);
	const parentId = getParentId(articleCsvItem, tagType, parentIdMap);
	return {
		id: articleCsvItem.id,
		genreType: genreType,
		tagType,
		parentId,
		pathName,
		title: articleCsvItem.program_title,
		titleMeta: articleCsvItem.title_meta,
		descriptionMeta: articleCsvItem.description_meta,
		networkId: articleCsvItem.network_1,
		seasonId: articleCsvItem.season ? articleCsvItem.season : undefined,
		thumbnail: {
			url: articleCsvItem.thumbnail,
			text: articleCsvItem.thumbnail_text,
			link: articleCsvItem.thumbnail_link.split(','),
		},
		categoryId: articleCsvItem.category,
		summary: {
			title: articleCsvItem.summary_title,
			text: articleCsvItem.summary_text,
			reference: articleCsvItem.summary_reference,
			link: articleCsvItem.summary_link.split(','),
		},
		authorOrganiation: articleCsvItem.author_organiation,
		staff: articleCsvItem.staff,
		otherProduction: articleCsvItem.production_2,
		sns: convertSns(articleCsvItem),
		durationTime: articleCsvItem.duration_time,
		seriesNumber: articleCsvItem.series_number,
		publisher: articleCsvItem.publisher,
		otherPublisher: articleCsvItem.other_publisher,
		website: articleCsvItem.website,
		originalWorkOrganization: articleCsvItem.original_work_organization,
		label: articleCsvItem.label,
		durationPeriod: articleCsvItem.duration_period,
		volume: articleCsvItem.volume,
		content: { genre: articleCsvItem.content_genre, subgenre: articleCsvItem.content_subgenre },
		distributor: articleCsvItem.distributor,
		distributorOverseas: articleCsvItem.distributor_overseas,
		copyright: articleCsvItem.copyright,
		productionYear: articleCsvItem.production_year,
		video: { text: articleCsvItem.video_text, url: articleCsvItem.video_url },
		sort: parseInt(articleCsvItem.id),
		['genreType#tagType#sort']: `${genreType}#${tagType}#${articleCsvItem.id}`,
		['pathName#sort']: `${pathName}#${articleCsvItem.id}`,
	};
}

function convertArticleProduction(articleCsvItem: ArticleCsvItem): ArticleProduction[] {
	const set: Set<string> = new Set();
	const result: ArticleProduction[] = [];
	if (!articleCsvItem.production_1) {
		return [];
	}
	articleCsvItem.production_1.split(',').forEach((item) => set.add(item));
	set.forEach((item) => {
		result.push({
			articleId: articleCsvItem.id,
			productionId: item,
		});
	});
	return result;
}

function convertArticleVodArray(articleCsvItem: ArticleCsvItem): ArticleVod[] {
	const set: Set<string> = new Set();
	const result: ArticleVod[] = [];
	if (!articleCsvItem.vod) {
		return [];
	}
	articleCsvItem.vod.split(',').forEach((item) => set.add(item));
	set.forEach((item) => {
		result.push({
			articleId: articleCsvItem.id,
			vodId: item,
		});
	});
	return result;
}

function convertArticlePersonArray(articleCsvItem: ArticleCsvItem): {
	articleAuthorArray: ArticlePerson[];
	articleDirectorArray: ArticlePerson[];
	articleProducerArray: ArticlePerson[];
	articleScreenwriterArray: ArticlePerson[];
	articleOriginalWorkArray: ArticlePerson[];
} {
	const articleAuthorSet: Set<string> = new Set();
	const articleAuthorArray: ArticlePerson[] = [];
	const articleDirectorSet: Set<string> = new Set();
	const articleDirectorArray: ArticlePerson[] = [];
	const articleProducerSet: Set<string> = new Set();
	const articleProducerArray: ArticlePerson[] = [];
	const articleScreenwriterSet: Set<string> = new Set();
	const articleScreenwriterArray: ArticlePerson[] = [];
	for (let i = 1; i <= 3; i++) {
		// @ts-ignore
		if (articleCsvItem['author_' + i]) {
			// @ts-ignore
			articleAuthorSet.add(articleCsvItem['author_' + i]);
		}
	}
	articleAuthorSet.forEach((item) =>
		articleAuthorArray.push({
			articleId: articleCsvItem.id,
			personId: item,
		})
	);
	for (let i = 1; i <= 3; i++) {
		// @ts-ignore
		if (articleCsvItem['director_' + i]) {
			// @ts-ignore
			articleDirectorSet.add(articleCsvItem['director_' + i]);
		}
	}
	articleDirectorSet.forEach((item) => articleDirectorArray.push({ articleId: articleCsvItem.id, personId: item }));
	for (let i = 1; i <= 3; i++) {
		// @ts-ignore
		if (articleCsvItem['producer_' + i]) {
			// @ts-ignore
			articleProducerSet.add(articleCsvItem['producer_' + i]);
		}
	}
	articleProducerSet.forEach((item) => articleProducerArray.push({ articleId: articleCsvItem.id, personId: item }));
	for (let i = 1; i <= 3; i++) {
		// @ts-ignore
		if (articleCsvItem['screenwriter_' + i]) {
			// @ts-ignore
			articleScreenwriterSet.add(articleCsvItem['screenwriter_' + i]);
		}
	}
	articleScreenwriterSet.forEach((item) =>
		articleScreenwriterArray.push({ articleId: articleCsvItem.id, personId: item })
	);
	const articleOriginalWorkSet: Set<string> = new Set();
	const articleOriginalWorkArray: ArticlePerson[] = [];
	if (articleCsvItem.original_work) {
		articleCsvItem.original_work.split(',').forEach((item) => articleOriginalWorkSet.add(item));
	}
	articleOriginalWorkSet.forEach((item) =>
		articleOriginalWorkArray.push({
			articleId: articleCsvItem.id,
			personId: item,
		})
	);
	return {
		articleOriginalWorkArray,
		articleAuthorArray,
		articleDirectorArray,
		articleProducerArray,
		articleScreenwriterArray,
	};
}

function convertArticleCastArray(articleCsvItem: ArticleCsvItem): ArticleCast[] {
	const set: Set<string> = new Set();
	const articleCastArray: ArticleCast[] = [];
	for (let i = 1; i <= 15; i++) {
		// @ts-ignore
		if (articleCsvItem['cast_' + i] && articleCsvItem['cast_role_' + i]) {
			// @ts-ignore
			const personId = articleCsvItem['cast_' + i];
			// @ts-ignore
			const roleName = articleCsvItem['cast_role_' + i];
			if (!set.has(personId)) {
				articleCastArray.push({
					articleId: articleCsvItem.id,
					personId: personId,
					roleName: roleName,
				});
				set.add(personId);
			}
		}
	}
	return articleCastArray;
}
