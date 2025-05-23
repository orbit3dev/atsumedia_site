import React, { ChangeEvent, useRef, useState } from 'react';
import { fileParser, objectMappers } from '@admin/_lib/utils/csv-to-json';
import { Button } from '@atsumedia/shared-ui';

type FileButtonProps<T> = {
	onSuccess?: () => void;
	onHandler?: (data: any) => Promise<void>;
	objectMappers: objectMappers;
	skipRows?: number;
	skipColumns?: number;
};

export function FileButton<T>({ onSuccess, onHandler, objectMappers, skipRows, skipColumns }: FileButtonProps<T>) {
	const fileInput = useRef<HTMLInputElement>(null);
	const [loading, setLoading] = useState(false);
	const handleClick = () => {
		fileInput.current?.click();
	};

	const handleFileInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files?.length === 0) {
			return;
		}
		const file = event.target.files![0];
		setLoading(true);
		const result = await fileParser(file, objectMappers, skipRows, skipColumns);
		// console.log(result);
		if (onHandler) {
			await onHandler(result);
		}
		if (onSuccess) {
			onSuccess();
		}
		setLoading(false);
		fileInput.current!.value = '';
	};

	return (
		<div>
			<Button className="mx-2 h-9 px-2 lg:px-3" disabled={loading} onClick={handleClick}>
				CSVアップロード
			</Button>
			<input
				type="file"
				ref={fileInput}
				onChange={(event) => handleFileInputChange(event)}
				style={{ display: 'none' }}
			/>
		</div>
	);
}
