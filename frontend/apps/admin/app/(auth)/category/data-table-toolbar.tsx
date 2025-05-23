import { Button, Input } from '@atsumedia/shared-ui';
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { QueryInfiniteStoreType } from '@sevenvip666/react-art';
import { CategoryTableType } from '@admin/(auth)/category/page';
import CsvUploadProvider from '@admin/(auth)/_components/csv-upload-provider';
import { checkId, checkStringNotEmpty } from '@admin/_lib/utils/csv-data-regx';
import { handleUpload } from '@admin/(auth)/category/csv-upload/csv-upload-uitls';

interface DataTableToolbarProps {
	onOpen: () => Promise<boolean>;
	store: QueryInfiniteStoreType<CategoryTableType[], { content: string; limit: number }>;
}

export const DataTableToolbar: React.FC<DataTableToolbarProps> = ({ onOpen, store }) => {
	const [search, setSearch] = useState('');
	return (
		<div className="mb-2 flex items-center justify-between">
			<div className="flex flex-1 items-center space-x-2">
				<Input
					placeholder="捜索"
					value={search}
					onChange={(value) => setSearch(value.target.value)}
					className="h-9 w-[150px] lg:w-[250px]"
				/>
				<Button
					variant="outline"
					className="mx-2 h-9 px-2 lg:px-3"
					onClick={async () => {
						store.query({ content: search }).then();
					}}>
					<Search className="mr-2 h-4 w-4" />
					検索
				</Button>
			</div>
			<CsvUploadProvider
				successCallback={store.refresh}
				genreType={'anime'}
				handleUpload={handleUpload}
				objectMappers={[
					{ name: 'id', index: 0, check: checkId },
					{ name: 'name', index: 1, check: checkStringNotEmpty },
				]}
				skipRows={3}
				skipColumns={1}
			/>
		</div>
	);
};
