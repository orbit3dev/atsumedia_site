import { UploadProps } from '@admin/(auth)/_components/csv-upload-provider';
import { NetworkCsvItem, NetworkItem } from '@admin/(auth)/network/csv-upload/model';
import { CsvUploadStatistic, CsvUploadStatus, TableName } from '@atsumedia/data';
import { dataPartitioning, handleTask } from '@admin/_lib/utils/csv-upload-data';
import { getTableName, userPoolClient } from '@atsumedia/amplify-client';

export const handleUpload = async (props: UploadProps<NetworkCsvItem>) => {
	const { data: csvDataArray, setStatus } = props;
	setStatus({ status: CsvUploadStatus.prepare, statistics: [] });

	const networkItemArray: NetworkItem[] = csvDataArray.map((item) => {
		return {
			id: item.id,
			name: item.name,
			type: TableName.Network,
			sort: parseInt(item.id),
		};
	});

	const list = dataPartitioning(
		networkItemArray,
		(items) =>
			userPoolClient.mutations.putNetwork({
				table: getTableName(TableName.Network),
				body: JSON.stringify(items),
			}),
		TableName.Network
	);
	const statistics: CsvUploadStatistic[] = [
		{ tableName: TableName.Network, total: networkItemArray.length, successCount: 0, errorCount: 0, error: [] },
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
