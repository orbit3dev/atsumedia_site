'use client';
import React from 'react';
import { useColumns } from '@admin/(auth)/network/columns';
import { DataTable, useModal } from '@atsumedia/shared-ui';
import { usePagination } from '@sevenvip666/react-art';
import { userPoolClient } from '@atsumedia/amplify-client';
import type { Schema } from '@atsumedia/amplify-backend';
import { DataTableToolbar } from '@admin/(auth)/network/data-table-toolbar';
import EditModal from '@admin/(auth)/network/edit-modal';
import { LayoutContent } from '@admin/(auth)/_components/layout-content';
import { TableName } from '@atsumedia/data';

export type NetworkType = Schema['Network']['type'];

const Page = () => {
	const editModal = useModal<NetworkType>();

	const { control, onOpen } = editModal;

	const store = usePagination<NetworkType[], { content: string; limit: number }>(
		({ limit, nextToken, content }) => {
			const param = {
				type: TableName.Network,
				limit: limit,
				nextToken: nextToken,
				sort: content ? { eq: parseInt(content) } : undefined,
			};
			// @ts-ignore
			return userPoolClient.models.Network.networkListByTypeAndId(param);
		},
		{
			getNextToken: (res) => res.nextToken,
		}
	);

	const columns = useColumns({ onOpen, query: store.query });

	return (
		<LayoutContent breadcrumb={[{ name: '放送局マスタ' }]}>
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
