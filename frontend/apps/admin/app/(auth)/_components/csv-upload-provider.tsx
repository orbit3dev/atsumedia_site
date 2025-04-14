import React, { useMemo, useState } from 'react';
import { CategoryType, CsvUploadStatistic, CsvUploadStatus, CsvUploadStatusResult } from '@atsumedia/data';
import { FileButton } from '@admin/(auth)/_components/upload-button';
import { objectMappers } from '@admin/_lib/utils/csv-to-json';
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@atsumedia/shared-ui';

export type UploadProps<T> = {
	data: T[];
	genreType: CategoryType;
	setStatus: (status: CsvUploadStatusResult) => void;
};

interface CsvUploadProviderProps<CSV> {
	successCallback: () => void;
	genreType: CategoryType;
	handleUpload: (props: UploadProps<CSV>) => Promise<void>;
	objectMappers: objectMappers;
	skipRows?: number;
	skipColumns?: number;
}

function CsvUploadProvider<CSV>({
	successCallback,
	genreType,
	handleUpload,
	objectMappers,
	skipRows,
	skipColumns,
}: CsvUploadProviderProps<CSV>) {
	const [status, setStatus] = useState<CsvUploadStatus>();
	const [showStatus, setShowStatus] = useState<boolean>(false);
	const [statistic, setStatistic] = useState<CsvUploadStatistic[]>();
	const statusName = useMemo(() => {
		switch (status) {
			case CsvUploadStatus.prepare:
				return <span className={'text-yellow-500'}>準備中</span>;
			case CsvUploadStatus.uploading:
				return <span className={'text-green-500'}>実行中</span>;
			case CsvUploadStatus.start:
				return <span className={'text-green-500'}>スタート</span>;
			case CsvUploadStatus.finish:
				return <span className={'text-amber-600'}>終了</span>;
		}
	}, [status]);

	const setCsvUploadStatusResult = (data: CsvUploadStatusResult) => {
		setStatus(data?.status);
		switch (data?.status) {
			case CsvUploadStatus.prepare:
				break;
			case CsvUploadStatus.start:
				data?.statistics?.sort((o1, o2) => o1.total - o2.total);
				setStatistic(data?.statistics);
				break;
			case CsvUploadStatus.uploading:
				setStatistic((state) =>
					state?.map((item) => {
						const target = data?.uploading?.get(item.tableName);
						if (target) {
							return {
								...item,
								successCount: item.successCount + target.successCount,
								errorCount: item.errorCount + target.errorCount,
								error: [...item.error, ...target.error],
							};
						}
						return item;
					})
				);
				break;
			case CsvUploadStatus.finish:
				break;
		}
	};

	const getItemStatus = (item: CsvUploadStatistic) => {
		if (item.successCount == 0 && item.errorCount == 0) {
			return <span className={'text-yellow-500'}>待機中</span>;
		} else if (item.total !== item.successCount + item.errorCount) {
			return <span className={'text-blue-500'}>実行中</span>;
		} else if (item.total === item.successCount) {
			return <span className={'text-green-500'}>成功</span>;
		} else if (item.errorCount > 0) {
			return (
				<span className={'text-red-500'}>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger className={'truncate '}>エラ</TooltipTrigger>
							<TooltipContent>
								{item.error.map((item) => (
									<div key={item}>{JSON.stringify(item)}</div>
								))}
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</span>
			);
		}
		return <span></span>;
	};
	return (
		<div className={'relative'}>
			<FileButton<{ genreType: CategoryType }>
				onSuccess={successCallback}
				onHandler={(data) => handleUpload({ data, genreType, setStatus: setCsvUploadStatusResult })}
				objectMappers={objectMappers}
				skipRows={skipRows}
				skipColumns={skipColumns}
			/>
			{showStatus && (
				<div
					className={
						'animate-in slide-in-from-right-96 absolute -top-[45px] right-2 z-20 rounded-sm bg-gray-200 p-2 hover:cursor-pointer'
					}
					onClick={() => setShowStatus(false)}>
					<div className={'text-sm'}>状態：{statusName} </div>
				</div>
			)}
			{statistic && !showStatus && (
				<div
					className={
						'animate-in slide-in-from-right-96 absolute right-0 top-[40px] z-20 max-h-[250px] w-[400px] overflow-y-auto rounded-sm bg-gray-200 p-3'
					}>
					<div className={'relative'}>
						状態：{statusName}{' '}
						<Button
							size={'sm'}
							className={'absolute -top-[5px] right-0 h-6 w-6 bg-gray-600'}
							onClick={() => setShowStatus(true)}>
							x
						</Button>
					</div>
					{statistic?.map((item, index) => (
						<div key={index} className={'mt-1 flex justify-between'}>
							<span className={'text-[14px] text-gray-600'}>
								{item.tableName}: <span className={'text-green-600'}>{item.successCount}</span>
								<span className={'text-gray-500'}> / </span>
								<span className={'text-red-400'}>{item.errorCount}</span>
								<span className={'text-gray-500'}> / </span>
								<span className={'text-gray-400'}> {item.total}</span>
							</span>
							<span className={'text-sm'}>{getItemStatus(item)}</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default CsvUploadProvider;
