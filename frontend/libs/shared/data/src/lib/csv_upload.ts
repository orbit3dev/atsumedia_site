export enum CsvUploadStatus {
	prepare,
	start,
	uploading,
	finish,
}

export type CsvUploadStatistic = {
	tableName: string;
	total: number;
	successCount: number;
	errorCount: number;
	error: any[];
};

export type CsvUploadUploading = Map<
	string,
	{
		successCount: number;
		errorCount: number;
		error: any[];
	}
>;

export type CsvUploadStatusResult = {
	status: CsvUploadStatus;
	statistics?: CsvUploadStatistic[];
	uploading?: CsvUploadUploading;
};
