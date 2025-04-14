import { DataTable } from '@atsumedia/shared-ui';
import type { Schema } from '@atsumedia/amplify-backend';
import { usePagination } from '@sevenvip666/react-art';
import { userPoolClient } from '@atsumedia/amplify-client';
import { DataTableToolbar } from '@admin/(auth)/article/data-table-toolbar';
import React from 'react';
import { useColumns } from '@admin/(auth)/article/columns';
import { CategoryType } from '@atsumedia/data';

export type ArticleType = Schema['Article']['type'];
const selectionSet = ['id', 'title', 'pathName', 'thumbnail.url', 'genreType', 'sort', 'parentId', 'tagType'] as const;
export type ArticleTableType = ArticleType;

type TagTableProps = {
	genreType: CategoryType;
};

export function ArticlesTable({ genreType }: TagTableProps) {
	const store = usePagination<ArticleTableType[], { limit: number; content: string }>(
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
	const columns = useColumns({ store });
	return (
		<>
			<DataTable
				columns={columns}
				store={store}
				toolbar={() => <DataTableToolbar store={store} genreType={genreType} />}
				// childNode={(item) => <TagListChilds item={item} />}
			/>
		</>
	);
}

// type ArticleListChildsProps = {
// 	item: ArticleWithComments;
// };
//
// function TagListChilds({ item }: ArticleListChildsProps) {
// 	return (
// 		<>
// 			{item.tags.length ? (
// 				sortBy(item.tags, 'order').map((item) => {
// 					return (
// 						<TableRow key={item.id} className="bg-gray-200/60">
// 							<TableCell></TableCell>
// 							<TableCell>{item.code}</TableCell>
// 							<TableCell>{item.name}</TableCell>
// 							<TableCell>{item.order}</TableCell>
// 							<TableCell></TableCell>
// 						</TableRow>
// 					);
// 				})
// 			) : (
// 				<TableRow className="bg-gray-200/60">
// 					<TableCell colSpan={7} className="h-24 text-center">
// 						結果がありません
// 					</TableCell>
// 				</TableRow>
// 			)}
// 		</>
// 	);
// }
