import { Button, Input } from '@atsumedia/shared-ui';
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { QueryInfiniteStoreType } from '@sevenvip666/react-art';
import { MusicType } from '@admin/(auth)/music/page';
import { checkId } from '@admin/_lib/utils/csv-data-regx';
import CsvUploadProvider from '@admin/(auth)/_components/csv-upload-provider';
import { handleUpload } from '@admin/(auth)/music/csv-upload/csv-upload-uitls';

interface DataTableToolbarProps {
	onOpen: () => Promise<boolean>;
	store: QueryInfiniteStoreType<MusicType[], { content: string; limit: number }>;
}

export const DataTableToolbar: React.FC<DataTableToolbarProps> = ({ onOpen, store }) => {
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
			{/*		const success = await onOpen();*/}
			{/*		if (success) {*/}
			{/*			store.refresh().then();*/}
			{/*		}*/}
			{/*	}}>*/}
			{/*	<Plus className="mr-2 h-4 w-4" />*/}
			{/*	新規*/}
			{/*</Button>*/}
			<CsvUploadProvider
				successCallback={store.refresh}
				genreType={'anime'}
				handleUpload={handleUpload}
				objectMappers={[
					{ name: 'id', index: 0, check: checkId },
					{ name: 'course', index: 1, check: checkId },
					{ name: 'op_artist', index: 2 },
					{ name: 'op_song', index: 3 },
					{ name: 'ed_artist', index: 4 },
					{ name: 'ed_song', index: 5 },
					{ name: 'other_artist', index: 6 },
					{ name: 'other_song', index: 7 },
				]}
				skipRows={3}
				skipColumns={1}
			/>
		</div>
	);
};
