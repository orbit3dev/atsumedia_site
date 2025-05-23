'use client';

import { format } from 'date-fns/format';
import {
	Active,
	Badge,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	useConfirm,
} from '@atsumedia/shared-ui';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useMutation } from '@sevenvip666/react-art';
import type { UserStatusType } from '@aws-sdk/client-cognito-identity-provider';
import type { ColumnDef } from '@tanstack/react-table';
import { userAuthStore } from '@admin/_lib/auth/auth-user';

export type UserModal = {
	username: string;
	lastModifiedDate: string;
	enabled: boolean;
	email: string;
	emailVerified: boolean;
	userStatus: UserStatusType;
};
export const useColumns = (config: {
	query: () => Promise<unknown>;
	onOpen: () => Promise<boolean>;
}): ColumnDef<UserModal>[] => {
	const sessionInfo = userAuthStore((state) => state.sessionInfo);
	const { mutate: disableUser } = useMutation<{ username: string }>('/disable-user', {
		loading: true,
		successMessage: '禁止するユーザーに成功しました。',
		onSuccess: () => config.query(),
	});
	const { mutate: enableUser } = useMutation<{ username: string }>('/enable-user', {
		loading: true,
		successMessage: '禁止解除に成功しました。',
		onSuccess: () => config.query(),
	});
	const { mutate: deleteUser } = useMutation<{ username: string }>('/delete-user', {
		loading: true,
		successMessage: '削除に成功しました。',
		onSuccess: () => config.query(),
	});

	const conform = useConfirm();
	return [
		{
			accessorKey: 'email',
			header: 'Eメール',
		},
		{
			accessorKey: 'emailVerified',
			minSize: 160,
			header: () => <div className="text-center">メール確認済み</div>,
			cell: ({ row }) => {
				const enabled = row.getValue<boolean>('emailVerified');
				return <div className="min-w-[90px] text-center">{enabled ? 'はい' : 'いいえ'}</div>;
			},
		},
		{
			accessorKey: 'userStatus',
			minSize: 180,
			header: () => <div className="text-center">確認ステータス</div>,
			cell: ({ row }) => {
				const userStatus = row.getValue<UserStatusType>('userStatus');
				const getEl = () => {
					switch (userStatus) {
						case 'CONFIRMED':
							return <Badge variant={'green'}>確認済み</Badge>;
						case 'FORCE_CHANGE_PASSWORD':
							return <Badge variant={'blue'}>パスワードを強制的に変更</Badge>;
						default:
							return <Badge variant={'outline'}>{userStatus}</Badge>;
					}
				};
				return <div className="min-w-[200px] text-center">{getEl()}</div>;
			},
		},
		{
			accessorKey: 'enabled',
			minSize: 120,
			header: () => <div className="text-center">有効</div>,
			cell: ({ row }) => {
				const active = row.getValue<boolean>('enabled');
				return (
					<div className="min-w-[90px] text-center">
						<Active active={active} />
					</div>
				);
			},
		},
		{
			accessorKey: 'lastModifiedDate',
			minSize: 200,
			header: () => <div className="text-center">最終更新日</div>,
			cell: ({ row }) => {
				const lastModifiedDate = row.getValue<string>('lastModifiedDate');
				const dateFormat = format(new Date(lastModifiedDate), 'yyyy/MM/dd HH:mm:SS');
				return <div className="whitespace-nowrap text-center">{dateFormat}</div>;
			},
		},
		{
			id: 'actions',
			minSize: 80,
			size: 100,
			enableHiding: false,
			cell: ({ row }) => {
				const payment = row.original;
				const { username, email } = payment;
				if (sessionInfo?.username === username) {
					return <></>;
				}
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-[22px] w-8 p-0">
								<span className="sr-only">Open menu</span>
								<DotsHorizontalIcon className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>行動</DropdownMenuLabel>
							{payment.enabled && (
								<DropdownMenuItem onClick={() => disableUser({ username })}>無効化</DropdownMenuItem>
							)}
							{!payment.enabled && (
								<DropdownMenuItem onClick={() => enableUser({ username })}>有効化</DropdownMenuItem>
							)}
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={async () => {
									// eslint-disable-next-line @typescript-eslint/ban-ts-comment
									// @ts-expect-error
									const success = await config.onOpen(payment);
									if (success) {
										config.query().then();
									}
								}}>
								更新
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={async () => {
									const success = await conform.open({
										title: `ユーザー「${email}」を削除しますか?`,
										description:
											'これにより、このユーザーはユーザープールから削除されます。ユーザーは完全に削除され、サインインできなくなります。 \n' +
											'ユーザープロファイルを削除する前に、ユーザーのサインインアクセスを無効にする必要があります。',
									});
									if (success) {
										deleteUser({ username });
									}
								}}>
								削除
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];
};
