'use client';
import React from 'react';
import { useColumns } from '@admin/(auth)/person/columns';
import { DataTable, useModal } from '@atsumedia/shared-ui';
import { usePagination } from '@sevenvip666/react-art';
import { userPoolClient } from '@atsumedia/amplify-client';
import type { Schema } from '@atsumedia/amplify-backend';
import { DataTableToolbar } from '@admin/(auth)/person/data-table-toolbar';
import EditModal from '@admin/(auth)/person/edit-modal';
import { LayoutContent } from '@admin/(auth)/_components/layout-content';
import { TableName } from '@atsumedia/data';

export type PersonType = Schema['Person']['type'];

const Page = () => {
	const editModal = useModal<PersonType>();

	const { control, onOpen } = editModal;

	const store = usePagination<PersonType[], { content: string; limit: number }>(
		({ limit, nextToken, content }) => {
			const params = {
				type: TableName.Person,
				limit: limit,
				nextToken: nextToken,
				sort: { eq: content ? parseInt(content) : undefined },
			};
			// @ts-ignore
			return userPoolClient.models.Person.personListByTypeAndId(params);
		},
		{
			getNextToken: (res) => res.nextToken,
		}
	);

	const columns = useColumns({ onOpen, query: store.query });

	return (
		<LayoutContent breadcrumb={[{ name: 'キャストマスタ' }]}>
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
