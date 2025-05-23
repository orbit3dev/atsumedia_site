'use client';
import React, { useEffect } from 'react';
import { useColumns } from '@admin/(auth)/music/columns';
import { DataTable, useModal } from '@atsumedia/shared-ui';
import { usePagination } from '@sevenvip666/react-art';
import { userPoolClient } from '@atsumedia/amplify-client';
import type { Schema } from '@atsumedia/amplify-backend';
import { DataTableToolbar } from '@admin/(auth)/music/data-table-toolbar';
import { LayoutContent } from '@admin/(auth)/_components/layout-content';
import { TableName } from '@atsumedia/data';

export type MusicType = Schema['ArticleMusic']['type'];

const Page = () => {
	const editModal = useModal<MusicType>();

	const { onOpen } = editModal;

	const store = usePagination<MusicType[], { content: string; limit: number }>(
		({ limit, nextToken, content }) => {
			const param = {
				type: TableName.ArticleMusic,
				limit: limit,
				nextToken: nextToken,
				sortCourse: content
					? {
							beginsWith: {
								sort: parseInt(content),
							},
						}
					: undefined,
			};
			// @ts-ignore
			return userPoolClient.models.ArticleMusic.musicListByTypeAndSortCourse(param);
		},
		{
			getNextToken: (res) => res.nextToken,
		}
	);

	const columns = useColumns({ onOpen, query: store.query });

	return (
		<LayoutContent breadcrumb={[{ name: '曲項目マスタ' }]}>
			<DataTable
				columns={columns}
				store={store}
				toolbar={() => <DataTableToolbar onOpen={onOpen} store={store} />}
			/>
		</LayoutContent>
	);
};

export default Page;
