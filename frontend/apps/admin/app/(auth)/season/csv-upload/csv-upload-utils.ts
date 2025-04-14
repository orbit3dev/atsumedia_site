import { UploadProps } from '@admin/(auth)/_components/csv-upload-provider';
import { CsvUploadStatistic, CsvUploadStatus, TableName } from '@atsumedia/data';
import { dataPartitioning, handleTask } from '@admin/_lib/utils/csv-upload-data';
import { getTableName, userPoolClient } from '@atsumedia/amplify-client';
import { SeasonCsvItem, SeasonItem } from '@admin/(auth)/season/csv-upload/model';

export const handleUpload = async (props: UploadProps<SeasonCsvItem>) => {
	const { data: csvDataArray, setStatus } = props;
	setStatus({ status: CsvUploadStatus.prepare, statistics: [] });

	const seasonItemArray: SeasonItem[] = csvDataArray.map((item) => {
		return {
			id: item.id,
			name: item.name,
			type: TableName.Season,
			sort: parseInt(item.id),
		};
	});

	const list = dataPartitioning(
		seasonItemArray,
		(items) =>
			userPoolClient.mutations.putSeason({
				table: getTableName(TableName.Season),
				body: JSON.stringify(items),
			}),
		TableName.Season
	);
	const statistics: CsvUploadStatistic[] = [
		{ tableName: TableName.Season, total: seasonItemArray.length, successCount: 0, errorCount: 0, error: [] },
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
