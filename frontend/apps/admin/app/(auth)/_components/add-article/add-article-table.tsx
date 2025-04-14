import { DataTable } from '@atsumedia/shared-ui';
import { usePagination } from '@sevenvip666/react-art';
import { userPoolClient } from '@atsumedia/amplify-client';
import React from 'react';
import { CategoryType } from '@atsumedia/data';
import { useAddArticleColumns } from '@admin/(auth)/_components/add-article/columns';
import { AddDataTableToolbar } from '@admin/(auth)/_components/add-article/add-data-table-toolbar';

const selectionSet = ['id', 'titleMeta', 'genreType', 'sort', 'parentId'] as const;
export type AddArticleTableType = {
	id: string;
	titleMeta: string;
	genreType: CategoryType;
	sort: number;
	parentId: string;
};

type TagTableProps = {
	genreType: CategoryType;
	selectedList: AddArticleTableType[];
	selectedRowsOnChange: (selected: boolean, rows: AddArticleTableType[]) => void;
};

export function AddArticlesTable({ genreType, selectedList, selectedRowsOnChange }: TagTableProps) {
	const store = usePagination<AddArticleTableType[], { limit: number; content: string }>(
		({ limit, nextToken, content }) => {
			const params = {
				genreType,
				limit: limit,
				nextToken: nextToken,
				selectionSet: selectionSet,
				sort: content ? { eq: parseInt(content) } : undefined,
			};
			// @ts-ignore
			return userPoolClient.models.Article.listByGenreTypeAndSort(params);
		},
		{
			getNextToken: (res) => res.nextToken,
		}
	);
	const columns = useAddArticleColumns({ selectedList, selectedRowsOnChange });
	return (
		<>
			<DataTable
				columns={columns}
				className={'max-h-[70vh] max-w-[950px] overflow-auto'}
				store={store}
				toolbar={() => <AddDataTableToolbar store={store} genreType={genreType} />}
			/>
		</>
	);
}
