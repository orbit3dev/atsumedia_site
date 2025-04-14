import { UploadProps } from '@admin/(auth)/_components/csv-upload-provider';
import { PersonCsvItem, PersonItem } from '@admin/(auth)/person/csv-upload/model';
import { CsvUploadStatistic, CsvUploadStatus, TableName } from '@atsumedia/data';
import { dataPartitioning, handleTask } from '@admin/_lib/utils/csv-upload-data';
import { getTableName, userPoolClient } from '@atsumedia/amplify-client';

export const handleUpload = async (props: UploadProps<PersonCsvItem>) => {
	const { data: csvDataArray, setStatus } = props;
	setStatus({ status: CsvUploadStatus.prepare, statistics: [] });

	const personItemArray: PersonItem[] = csvDataArray.map((item) => {
		return {
			id: item.id,
			name: item.name,
			image: item.image,
			type: TableName.Person,
			sort: parseInt(item.id),
		};
	});

	const list = dataPartitioning(
		personItemArray,
		(items) =>
			userPoolClient.mutations.putPerson({
				table: getTableName(TableName.Person),
				body: JSON.stringify(items),
			}),
		TableName.Person
	);
	const statistics: CsvUploadStatistic[] = [
		{ tableName: TableName.Person, total: personItemArray.length, successCount: 0, errorCount: 0, error: [] },
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
