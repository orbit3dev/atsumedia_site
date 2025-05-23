import { CsvUploadStatus, CsvUploadStatusResult, CsvUploadUploading } from '@atsumedia/data';

type ResultType = { errors?: any[] };

type ActionType = {
	tableName: string;
	action: () => Promise<ResultType>;
	count: number;
};

const reqBodyLimit = 25;

export function dataPartitioning<T>(
	arrayA: T[],
	batchPutAction: (item: T[]) => Promise<ResultType>,
	tableName: string
): ActionType[] {
	const partitions = chunkArray(arrayA, reqBodyLimit);
	const result: ActionType[] = [];
	for (const partition of partitions) {
		result.push({
			tableName,
			action: () => batchPutAction(partition),
			count: partition.length,
		});
	}
	return result;
}

function chunkArray<T>(array: T[], size: number) {
	return array.reduce((acc: T[][], value, index) => {
		const chunkIndex = Math.floor(index / size);
		if (!acc[chunkIndex]) {
			acc[chunkIndex] = [];
		}
		acc[chunkIndex].push(value);
		return acc;
	}, []);
}

const sleep = (millisecond: number) => {
	return new Promise((resolve, reject) => {
		console.log('暂停一秒，防止被限流');
		setTimeout(() => {
			resolve('');
		}, millisecond);
	});
};

export async function handleTask(list: ActionType[], setStatus: (status: CsvUploadStatusResult) => void, limitNum = 5) {
	const partitions = chunkArray(list, limitNum);
	for (const partition of partitions) {
		console.log('发送请求');
		const actions: Promise<ResultType>[] = [];
		const uploading: CsvUploadUploading = new Map();
		const success: { tableName: string; successCount: number; errorCount: number; error: any[] }[] = [];
		partition.forEach((item) => {
			success.push({ tableName: item.tableName, successCount: item.count, errorCount: 0, error: [] });
			actions.push(item.action());
		});
		const res = await Promise.all(actions);
		success
			.map((item, index) => {
				const errors = res[index].errors;
				if (errors && errors.length > 0) {
					item.error = errors;
					item.errorCount = item.successCount;
					item.successCount = 0;
				}
				return { ...item };
			})
			.forEach((item) => {
				if (uploading.has(item.tableName)) {
					const mapItem = uploading.get(item.tableName);
					if (mapItem) {
						mapItem.successCount += item.successCount;
						mapItem.errorCount += item.errorCount;
						mapItem.error = item.error;
					}
				} else {
					uploading.set(item.tableName, {
						successCount: item.successCount,
						errorCount: item.errorCount,
						error: item.error,
					});
				}
			});
		setStatus({
			status: CsvUploadStatus.uploading,
			uploading,
		});
		// await sleep(500);
	}
}
