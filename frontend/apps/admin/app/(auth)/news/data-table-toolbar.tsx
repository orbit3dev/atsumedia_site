import { QueryInfiniteStoreType } from '@sevenvip666/react-art';
import { NewsTableType } from '@admin/(auth)/news/news-table';
import { CategoryType } from '@atsumedia/data';
import React, { useState } from 'react';
import { Button, Input } from '@atsumedia/shared-ui';
import { Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DataTableToolbarProps {
	store: QueryInfiniteStoreType<NewsTableType[], { limit: number; content: string }>;
	genreType: CategoryType;
}

export const DataTableToolbar: React.FC<DataTableToolbarProps> = ({ store, genreType }) => {
	const router = useRouter();
	const [search, setSearch] = useState('');
	return (
		<div className="mb-2 flex items-center justify-between">
			<div className="flex flex-1 items-center space-x-2">
				<Input
					placeholder="タイトル"
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
			<Button
				variant="outline"
				className="mx-2 h-9 px-2 lg:px-3"
				onClick={() => {
					router.push(`/news/${genreType}`);
				}}>
				<Plus className="mr-2 h-4 w-4" />
				新規
			</Button>
		</div>
	);
};
