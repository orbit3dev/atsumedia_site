'use client';
import React from 'react';
import { useColumns } from '@admin/(auth)/production/columns';
import { DataTable } from '@atsumedia/shared-ui';
import { usePagination } from '@sevenvip666/react-art';
import { userPoolClient } from '@atsumedia/amplify-client';
import type { Schema } from '@atsumedia/amplify-backend';
import { DataTableToolbar } from '@admin/(auth)/production/data-table-toolbar';
import { LayoutContent } from '@admin/(auth)/_components/layout-content';
import { TableName } from '@atsumedia/data';

export type ProductionTableType = Schema['Production']['type'];

const Page = () => {
	const store = usePagination<ProductionTableType[], { content: string; limit: number }>(
		({ limit, nextToken, content }) => {
			const params = {
				type: TableName.Production,
				limit: limit,
				nextToken: nextToken,
				sort: content ? { eq: parseInt(content) } : undefined,
			};
			// @ts-ignore
			return userPoolClient.models.Production.productionListByTypeAndId(params);
		},
		{
			getNextToken: (res) => res.nextToken,
		}
	);

	const columns = useColumns({ query: store.query });

	return (
		<LayoutContent breadcrumb={[{ name: '制作会社' }]}>
			<DataTable columns={columns} store={store} toolbar={() => <DataTableToolbar store={store} />} />
		</LayoutContent>
	);
};

export default Page;
