'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	useConfirm,
} from '@atsumedia/shared-ui';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { QueryInfiniteStoreType, useMutation } from '@sevenvip666/react-art';
import { userPoolClient } from '@atsumedia/amplify-client';
import { PageSettingType } from '@admin/(auth)/pageSetting/page-setting-table';

export const useColumns = ({
	store,
}: {
	store: QueryInfiniteStoreType<PageSettingType[]>;
}): ColumnDef<PageSettingType>[] => {
	const conform = useConfirm();
	const { mutate: deletePageSetting } = useMutation<{ articleId: string; type: string }>(
		({ articleId, type }) => userPoolClient.models.PageSetting.delete({ articleId, type }),
		{
			loading: true,
			successMessage: '削除に成功しました。',
			onSuccess: () => store.query(),
		}
	);
	return [
		{
			accessorKey: 'articleId',
			header: 'ID',
		},
		{
			accessorKey: 'sort',
			header: '順番',
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
							<DropdownMenuItem
								onClick={async () => {
									const success = await conform.open({
										title: `「${payment.articleId}」を削除しますか?`,
										description: '',
										cancelText: 'キャンセル',
										confirmText: '確認',
									});
									if (success) {
										deletePageSetting({ articleId: payment.articleId, type: payment.type });
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
