import { Button, Input } from '@atsumedia/shared-ui';
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { QueryInfiniteStoreType } from '@sevenvip666/react-art';
import { CategoryType } from '@atsumedia/data';
import { AddArticleTableType } from '@admin/(auth)/_components/add-article/add-article-table';

interface AddDataTableToolbarProps {
	store: QueryInfiniteStoreType<AddArticleTableType[], { limit: number; content: string }>;
	genreType: CategoryType;
}

export const AddDataTableToolbar: React.FC<AddDataTableToolbarProps> = ({ store, genreType }) => {
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
		</div>
	);
};
