import { CsvUploadStatistic, CsvUploadStatus, TableName } from '@atsumedia/data';
import { dataPartitioning, handleTask } from '@admin/_lib/utils/csv-upload-data';
import { getTableName, userPoolClient } from '@atsumedia/amplify-client';
import { UploadProps } from '@admin/(auth)/_components/csv-upload-provider';
import { ArticleMusicCsvItem, ArticleMusicItem } from '@admin/(auth)/music/csv-upload/model';

export const handleUpload = async (props: UploadProps<ArticleMusicCsvItem>) => {
	const { data: csvDataArray, setStatus } = props;
	setStatus({ status: CsvUploadStatus.prepare, statistics: [] });

	// const map: Map<string, ArticleMusicItem> = new Map<string, ArticleMusicItem>();

	const articleMusicItemArray = csvDataArray.map((item) => {
		// const articleMusicItem = convertArticleMusicItem(item);
		// const id = articleMusicItem.articleId + '|' + articleMusicItem.course;
		// if (map.has(id)) {
		// 	console.log(articleMusicItem);
		// } else {
		// 	map.set(id, articleMusicItem);
		// }
		// return articleMusicItem;
		return convertArticleMusicItem(item);
	});

	const list = dataPartitioning(
		articleMusicItemArray,
		(items) =>
			userPoolClient.mutations.putArticleMusic({
				table: getTableName(TableName.ArticleMusic),
				body: JSON.stringify(items),
			}),
		TableName.ArticleMusic
	);
	const statistics: CsvUploadStatistic[] = [
		{
			tableName: TableName.ArticleMusic,
			total: articleMusicItemArray.length,
			successCount: 0,
			errorCount: 0,
			error: [],
		},
	];
	setStatus({
		status: CsvUploadStatus.start,
		statistics,
	});
	await handleTask(list, setStatus);
	setStatus({
		status: CsvUploadStatus.finish,
	});
};

function convertArticleMusicItem(articleMusicCsvItem: ArticleMusicCsvItem): ArticleMusicItem {
	return {
		articleId: articleMusicCsvItem.id,
		course: parseInt(articleMusicCsvItem.course),
		opArtist: articleMusicCsvItem.op_artist,
		opSong: articleMusicCsvItem.op_song,
		edArtist: articleMusicCsvItem.ed_artist,
		edSong: articleMusicCsvItem.ed_song,
		otherArtist: articleMusicCsvItem.other_artist,
		otherSon: articleMusicCsvItem.other_song,
		type: TableName.ArticleMusic,
		sort: parseInt(articleMusicCsvItem.id),
		['sort#course']: `${parseInt(articleMusicCsvItem.id)}#${parseInt(articleMusicCsvItem.course)}`,
	};
}
