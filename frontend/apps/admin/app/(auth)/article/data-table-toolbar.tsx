import { Button, Input } from '@atsumedia/shared-ui';
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { QueryInfiniteStoreType } from '@sevenvip666/react-art';
import { ArticleTableType } from '@admin/(auth)/article/article-table';
import { CategoryType } from '@atsumedia/data';
import CsvUploadProvider from '@admin/(auth)/_components/csv-upload-provider';
import { handleUpload } from '@admin/(auth)/article/csv-upload/csv-upload-uitls';
import { objectMappers } from '@admin/(auth)/article/csv-object-mappers';

interface DataTableToolbarProps {
	store: QueryInfiniteStoreType<ArticleTableType[], { limit: number; content: string }>;
	genreType: CategoryType;
}

export const DataTableToolbar: React.FC<DataTableToolbarProps> = ({ store, genreType }) => {
	const [search, setSearch] = useState('');
	return (
		<div className="mb-2 flex items-center justify-between">
			<div className="flex flex-1 items-center space-x-2">
				<Input
					placeholder="ID"
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
			{/*<Button*/}
			{/*	variant="outline"*/}
			{/*	className="mx-2 h-9 px-2 lg:px-3"*/}
			{/*	onClick={async () => {*/}
			{/*		const success = await model.onOpen({ genreType });*/}
			{/*		if (success) {*/}
			{/*			store.refresh().then();*/}
			{/*		}*/}
			{/*	}}>*/}
			{/*	<Plus className="mr-2 h-4 w-4" />*/}
			{/*	新規*/}
			{/*</Button>*/}
			{/*<FileButton<{ genreType: CategoryType }>*/}
			{/*	url={'/api/article'}*/}
			{/*	onSuccess={() => store.refresh().then()}*/}
			{/*	objectMappers={objectMappers}*/}
			{/*	skipRows={3}*/}
			{/*	skipColumns={2}*/}
			{/*	body={{ genreType }}*/}
			{/*/>*/}
			<CsvUploadProvider
				successCallback={store.refresh}
				genreType={genreType}
				handleUpload={handleUpload}
				objectMappers={objectMappers}
				skipRows={3}
				skipColumns={2}
			/>
		</div>
	);
};
