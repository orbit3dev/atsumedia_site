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
import { MusicType } from '@admin/(auth)/music/page';
import { useMutation } from '@sevenvip666/react-art';
import { userPoolClient } from '@atsumedia/amplify-client';

export const useColumns = (config: {
	query: () => Promise<unknown>;
	onOpen: () => Promise<boolean>;
}): ColumnDef<MusicType>[] => {
	const conform = useConfirm();
	const { mutate: deleteMusic } = useMutation<{ articleId: string; course: number }>(
		({ articleId, course }) => userPoolClient.models.ArticleMusic.delete({ articleId, course }),
		{
			loading: true,
			successMessage: '削除に成功しました。',
			onSuccess: () => config.query(),
		}
	);
	return [
		{
			accessorKey: 'articleId',
			header: 'ID',
		},
		{
			accessorKey: 'course',
			header: 'クール',
		},
		{
			accessorKey: 'opArtist',
			header: 'オープニング_制作',
		},
		{
			accessorKey: 'opSong',
			header: 'オープニング_曲',
		},
		{
			accessorKey: 'edArtist',
			header: 'エンディング_制作',
		},
		{
			accessorKey: 'edSong',
			header: 'エンディング_曲',
		},
		{
			accessorKey: 'otherArtist',
			header: 'その他音楽_制作',
		},
		{
			accessorKey: 'otherSon',
			header: 'その他音楽_曲',
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
							{/*<DropdownMenuSeparator />*/}
							<DropdownMenuItem
								onClick={async () => {
									const success = await conform.open({
										title: `「${payment.articleId}」を削除しますか?`,
										description: '',
										cancelText: 'キャンセル',
										confirmText: '確認',
									});
									if (success) {
										deleteMusic({ articleId: payment.articleId, course: payment.course });
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
