'use client';

import { QueryInfiniteStoreType, useMutation } from '@sevenvip666/react-art';
import { NewsTableType } from '@admin/(auth)/news/news-table';
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
import { userPoolClient } from '@atsumedia/amplify-client';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export function useColumns({ store }: { store: QueryInfiniteStoreType<NewsTableType[]> }): ColumnDef<NewsTableType>[] {
	const conform = useConfirm();
	const router = useRouter();
	const { mutate: deleteNes } = useMutation<{ id: string }>(({ id }) => userPoolClient.models.News.delete({ id }), {
		loading: true,
		successMessage: '削除に成功しました。',
		onSuccess: () => store.query(),
	});
	return [
		{
			accessorKey: 'title',
			header: 'タイトル',
		},
		{
			accessorKey: 'pathName',
			header: 'slug(URL文字列)',
		},
		{
			accessorKey: 'outline',
			header: 'あらすじ',
		},
		{
			header: '公開 / 非公開選択',
			cell: ({ row }) => {
				const item = row.original;
				return item.isPublic === 1 ? '公開' : '非公開';
			},
		},
		{
			header: 'TOP画面に表示',
			cell: ({ row }) => {
				const item = row.original;
				return item.isTop === 1 ? '表示' : '非表示';
			},
		},
		{
			header: '日付',
			cell: ({ row }) => {
				const item = row.original;
				return format(item.datetime, 'yyyy年MM月dd日 HH時mm分');
			},
		},
		{
			id: 'actions',
			size: 100,
			enableHiding: false,
			cell: ({ row }) => {
				const item = row.original;
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
								onClick={() => {
									router.push(`/news/${item.genreType}/${item.id}`);
								}}>
								編集
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={async () => {
									const success = await conform.open({
										title: `「${item.id}」を削除しますか?`,
										description: '',
										cancelText: 'キャンセル',
										confirmText: '確認',
									});
									if (success) {
										deleteNes({ id: item.id });
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
}
