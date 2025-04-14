import { UploadProps } from '@admin/(auth)/_components/csv-upload-provider';
import { PageSettingCsvItem, PageSettingItem } from '@admin/(auth)/pageSetting/csv-upload/model';
import { CsvUploadStatistic, CsvUploadStatus, TableName } from '@atsumedia/data';
import { dataPartitioning, handleTask } from '@admin/_lib/utils/csv-upload-data';
import { getTableName, userPoolClient } from '@atsumedia/amplify-client';

export const handleUpload = async (props: UploadProps<PageSettingCsvItem>) => {
	const { data: csvDataArray, setStatus } = props;
	setStatus({ status: CsvUploadStatus.prepare, statistics: [] });

	const pageSettingItemArray = csvDataArray.map((item) => {
		return convertPageSettingItem(item);
	});

	const list = dataPartitioning(
		pageSettingItemArray,
		(items) =>
			userPoolClient.mutations.putPageSetting({
				table: getTableName(TableName.PageSetting),
				body: JSON.stringify(items),
			}),
		TableName.PageSetting
	);
	const statistics: CsvUploadStatistic[] = [
		{
			tableName: TableName.PageSetting,
			total: pageSettingItemArray.length,
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

function convertPageSettingItem(pageSettingCsvItem: PageSettingCsvItem): PageSettingItem {
	return {
		articleId: pageSettingCsvItem.articleId,
		type: pageSettingCsvItem.genreType + '-' + pageSettingCsvItem.type,
		sort: parseInt(pageSettingCsvItem.sort),
	};
}
