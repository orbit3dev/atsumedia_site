import { CsvUploadStatistic, CsvUploadStatus, TableName } from '@atsumedia/data';
import { CategoryCsvItem, CategoryItem } from '@admin/(auth)/category/csv-upload/model';
import { dataPartitioning, handleTask } from '@admin/_lib/utils/csv-upload-data';
import { getTableName, userPoolClient } from '@atsumedia/amplify-client';
import { UploadProps } from '@admin/(auth)/_components/csv-upload-provider';

export const handleUpload = async (props: UploadProps<CategoryCsvItem>) => {
	const { data: csvDataArray, setStatus } = props;
	setStatus({ status: CsvUploadStatus.prepare, statistics: [] });
	const categoryItemArray: CategoryItem[] = csvDataArray.map((item) => {
		return {
			id: item.id,
			name: item.name,
			type: TableName.Category,
			sort: parseInt(item.id),
		};
	});
	const categoryTaskList = dataPartitioning(
		categoryItemArray,
		(items) =>
			userPoolClient.mutations.putCategory({
				table: getTableName(TableName.Category),
				body: JSON.stringify(items),
			}),
		TableName.Category
	);
	const statistics: CsvUploadStatistic[] = [
		{ tableName: TableName.Category, total: categoryItemArray.length, successCount: 0, errorCount: 0, error: [] },
	];
	setStatus({
		status: CsvUploadStatus.start,
		statistics,
	});
	await handleTask(categoryTaskList, setStatus);
	setStatus({
		status: CsvUploadStatus.finish,
	});
};
