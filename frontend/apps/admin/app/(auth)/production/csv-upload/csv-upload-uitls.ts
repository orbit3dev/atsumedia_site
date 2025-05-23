import { CsvUploadStatistic, CsvUploadStatus, TableName } from '@atsumedia/data';
import { ProductionItem, ProductionCsvItem } from '@admin/(auth)/production/csv-upload/model';
import { dataPartitioning, handleTask } from '@admin/_lib/utils/csv-upload-data';
import { getTableName, userPoolClient } from '@atsumedia/amplify-client';
import { UploadProps } from '@admin/(auth)/_components/csv-upload-provider';

export const handleUpload = async (props: UploadProps<ProductionCsvItem>) => {
	const { data: csvDataArray, setStatus } = props;
	setStatus({ status: CsvUploadStatus.prepare, statistics: [] });
	const productionItemArray: ProductionItem[] = csvDataArray.map((item) => {
		return {
			id: item.id,
			name: item.name,
			type: TableName.Production,
			sort: parseInt(item.id),
		};
	});
	const productionTaskList = dataPartitioning(
		productionItemArray,
		(items) =>
			userPoolClient.mutations.putProduction({
				table: getTableName(TableName.Production),
				body: JSON.stringify(items),
			}),
		TableName.Production
	);
	const statistics: CsvUploadStatistic[] = [
		{
			tableName: TableName.Production,
			total: productionItemArray.length,
			successCount: 0,
			errorCount: 0,
			error: [],
		},
	];
	setStatus({
		status: CsvUploadStatus.start,
		statistics,
	});
	await handleTask(productionTaskList, setStatus);
	setStatus({
		status: CsvUploadStatus.finish,
	});
};
