'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	useConfirm,
} from '@atsumedia/shared-ui';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { SeasonType } from '@admin/(auth)/season/page';
import { useMutation } from '@sevenvip666/react-art';
import { userPoolClient } from '@atsumedia/amplify-client';

export const useColumns = (config: {
	query: () => Promise<unknown>;
	onOpen: () => Promise<boolean>;
}): ColumnDef<SeasonType>[] => {
	const conform = useConfirm();
	const { mutate: deleteSeason } = useMutation<{ id: string }>(
		({ id }) => userPoolClient.models.Season.delete({ id }),
		{
			loading: true,
			successMessage: '削除に成功しました。',
			onSuccess: () => config.query(),
		}
	);
	return [
		{
			accessorKey: 'id',
			header: 'ID',
		},
		{
			accessorKey: 'name',
			header: 'クール名',
		},
		{
			id: 'actions',
			minSize: 80,
			size: 100,
			enableHiding: false,
			cell: ({ row }) => {
				const payment = row.original;
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-[22px] w-8 p-0">
								<span className="sr-only">Open menu</span>
								<DotsHorizontalIcon className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{/*<DropdownMenuItem*/}
							{/*	onClick={async () => {*/}
							{/*		// eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
							{/*		// @ts-expect-error*/}
							{/*		const success = await config.onOpen(payment);*/}
							{/*		if (success) {*/}
							{/*			config.query().then();*/}
							{/*		}*/}
							{/*	}}>*/}
							{/*	更新*/}
							{/*</DropdownMenuItem>*/}
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={async () => {
									const success = await conform.open({
										title: `「${payment.id}」を削除しますか?`,
										description: '',
										cancelText: 'キャンセル',
										confirmText: '確認',
									});
									if (success) {
										deleteSeason({ id: payment.id });
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
