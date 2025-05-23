'use client';
import React from 'react';
import { useColumns, UserModal } from '@admin/(auth)/manager/columns';
import { DataTable, useModal } from '@atsumedia/shared-ui';
import { usePagination } from '@sevenvip666/react-art';
import { USER_POOL_GROUP_ADMINS } from '@atsumedia/amplify-backend';
import { DataTableToolbar } from '@admin/(auth)/manager/data-table-toolbar';
import { AddModal } from '@admin/(auth)/manager/add-modal';
import type { UserType } from '@aws-sdk/client-cognito-identity-provider';
import { UpdateModal } from '@admin/(auth)/manager/update-modal';
import { LayoutContent } from '@admin/(auth)/_components/layout-content';

const Page = () => {
	const addModal = useModal<void>();
	const updateModal = useModal<UserModal>();

	const store = usePagination<UserModal[], { group: string }>('/list-users-in-group', {
		defaultBody: { group: USER_POOL_GROUP_ADMINS },
		postData: (data) =>
			data?.Users.map(({ Username, Enabled, UserStatus, UserLastModifiedDate, Attributes }: UserType) => {
				return {
					username: Username,
					lastModifiedDate: UserLastModifiedDate,
					enabled: Enabled,
					email: Attributes?.find((a) => a.Name == 'email')?.Value,
					emailVerified: Attributes?.find((a) => a.Name == 'email_verified')?.Value ?? false,
					userStatus: UserStatus,
				};
			}),
		getNextToken: (res) => res.data.NextToken,
	});

	const columns = useColumns({ query: store.query, onOpen: updateModal.onOpen });

	return (
		<LayoutContent breadcrumb={[{ name: '管理员管理' }]}>
			<DataTable
				columns={columns}
				store={store}
				toolbar={() => <DataTableToolbar onOpen={addModal.onOpen} query={store.query} />}
			/>
			<AddModal control={addModal.control} title={() => '管理者の追加'} />
			<UpdateModal control={updateModal.control} title={() => '更新用户信息'} />
		</LayoutContent>
	);
};

export default Page;
