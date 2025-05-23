import { UploadProps } from '@admin/(auth)/_components/csv-upload-provider';
import { CsvUploadStatistic, CsvUploadStatus, TableName } from '@atsumedia/data';
import { dataPartitioning, handleTask } from '@admin/_lib/utils/csv-upload-data';
import { getTableName, userPoolClient } from '@atsumedia/amplify-client';
import { VodCsvItem, VodItem } from '@admin/(auth)/vod/csv-upload/model';

export const handleUpload = async (props: UploadProps<VodCsvItem>) => {
	const { data: csvDataArray, setStatus } = props;
	setStatus({ status: CsvUploadStatus.prepare, statistics: [] });

	const vodItemArray: VodItem[] = csvDataArray.map((item) => {
		return {
			id: item.id,
			name: item.name,
			microcopy: item.microcopy,
			url: item.url,
			type: TableName.Vod,
			sort: parseInt(item.id),
		};
	});

	const list = dataPartitioning(
		vodItemArray,
		(items) =>
			userPoolClient.mutations.putVod({
				table: getTableName(TableName.Vod),
				body: JSON.stringify(items),
			}),
		TableName.Vod
	);
	const statistics: CsvUploadStatistic[] = [
		{ tableName: TableName.Vod, total: vodItemArray.length, successCount: 0, errorCount: 0, error: [] },
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
