'use client';
import React from 'react';
import { useColumns } from '@admin/(auth)/season/columns';
import { DataTable, useModal } from '@atsumedia/shared-ui';
import { usePagination } from '@sevenvip666/react-art';
import { userPoolClient } from '@atsumedia/amplify-client';
import type { Schema } from '@atsumedia/amplify-backend';
import { DataTableToolbar } from '@admin/(auth)/season/data-table-toolbar';
import EditModal from '@admin/(auth)/season/edit-modal';
import { LayoutContent } from '@admin/(auth)/_components/layout-content';
import { TableName } from '@atsumedia/data';

export type SeasonType = Schema['Season']['type'];

const Page = () => {
	const editModal = useModal<SeasonType>();

	const { control, onOpen } = editModal;

	const store = usePagination<SeasonType[], { content: string; limit: number }>(
		({ limit, nextToken, content }) => {
			const param = {
				type: TableName.Season,
				limit: limit,
				nextToken: nextToken,
				sort: content ? { eq: parseInt(content) } : undefined,
			};
			// @ts-ignore
			return userPoolClient.models.Season.seasonListByTypeAndId(param);
		},
		{
			getNextToken: (res) => res.nextToken,
		}
	);

	const columns = useColumns({ onOpen, query: store.query });

	return (
		<LayoutContent breadcrumb={[{ name: 'シーズンマスタ' }]}>
			<DataTable
				columns={columns}
				store={store}
				toolbar={() => <DataTableToolbar onOpen={onOpen} store={store} />}
			/>
			<EditModal control={control} title={() => ''} />
		</LayoutContent>
	);
};

export default Page;
