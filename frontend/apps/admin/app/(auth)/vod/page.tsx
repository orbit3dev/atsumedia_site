'use client';
import React from 'react';
import { useColumns } from '@admin/(auth)/vod/columns';
import { DataTable, useModal } from '@atsumedia/shared-ui';
import { usePagination } from '@sevenvip666/react-art';
import { userPoolClient } from '@atsumedia/amplify-client';
import type { Schema } from '@atsumedia/amplify-backend';
import { DataTableToolbar } from '@admin/(auth)/vod/data-table-toolbar';
import EditModal from '@admin/(auth)/vod/edit-modal';
import { LayoutContent } from '@admin/(auth)/_components/layout-content';
import { TableName } from '@atsumedia/data';

export type VodType = Schema['Vod']['type'];

const Page = () => {
	const editModal = useModal<VodType>();

	const { control, onOpen } = editModal;

	const store = usePagination<VodType[], { content: string; limit: number }>(
		({ limit, nextToken, content }) => {
			const params = {
				type: TableName.Vod,
				limit: limit,
				nextToken: nextToken,
				sort: content ? { eq: parseInt(content) } : undefined,
			};
			// @ts-ignore
			return userPoolClient.models.Vod.vodListByTypeAndId(params);
		},
		{
			getNextToken: (res) => res.nextToken,
		}
	);

	const columns = useColumns({ onOpen, query: store.query });

	return (
		<LayoutContent breadcrumb={[{ name: 'VODマスタ' }]}>
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
