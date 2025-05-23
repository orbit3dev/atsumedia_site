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
import { ArticleTableType } from '@admin/(auth)/article/article-table';
import { QueryInfiniteStoreType, useMutation } from '@sevenvip666/react-art';
import { userPoolClient } from '@atsumedia/amplify-client';
import { Article } from '@atsumedia/data';

async function deleteIntermediateTable(id: string) {
	const params = {
		selectionSet: [
			'pageSetting.type',
			'vods.vodId',
			'authors.personId',
			'directors.personId',
			'producers.personId',
			'screenwriters.personId',
			'productions.productionId',
			'casts.personId',
			'articleOriginalWorks.*',
			'musics.course',
		],
	};

	// @ts-ignore
	const res = await userPoolClient.models.Article.get({ id }, params);
	console.log(res);
	const article = res.data as Article;
	if (!article) {
		return;
	}
	console.log('delete ArticleVod =========>');
	for (let i = 0; i < article.vods.length; i++) {
		const params = {
			articleId: id,
			vodId: article.vods[i].vodId,
		};
		// @ts-ignore
		const res = await userPoolClient.models.ArticleVod.delete(params);
		console.log(res);
	}
	console.log('delete ArticleAuthor =========>');
	for (let i = 0; i < article.authors.length; i++) {
		const params = {
			articleId: id,
			personId: article.authors[i].personId,
		};
		// @ts-ignore
		const res = await userPoolClient.models.ArticleAuthor.delete(params);
		console.log(res);
	}
	console.log('delete ArticleDirector =========>');
	for (let i = 0; i < article.directors.length; i++) {
		const params = {
			articleId: id,
			personId: article.directors[i].personId,
		};
		// @ts-ignore
		const res = await userPoolClient.models.ArticleDirector.delete(params);
		console.log(res);
	}
	console.log('delete ArticleProducer =========>');
	for (let i = 0; i < article.producers.length; i++) {
		const params = {
			articleId: id,
			personId: article.producers[i].personId,
		};
		// @ts-ignore
		const res = await userPoolClient.models.ArticleProducer.delete(params);
		console.log(res);
	}
	console.log('delete ArticleScreenwriter =========>');
	for (let i = 0; i < article.screenwriters.length; i++) {
		const params = {
			articleId: id,
			personId: article.screenwriters[i].personId,
		};
		// @ts-ignore
		const res = await userPoolClient.models.ArticleScreenwriter.delete(params);
		console.log(res);
	}
	console.log('delete ArticleProduction =========>');
	for (let i = 0; i < article.productions.length; i++) {
		const params = {
			articleId: id,
			productionId: article.productions[i].productionId,
		};
		// @ts-ignore
		const res = await userPoolClient.models.ArticleProduction.delete(params);
		console.log(res);
	}
	console.log('delete ArticleCast =========>');
	for (let i = 0; i < article.casts.length; i++) {
		const params = {
			articleId: id,
			personId: article.casts[i].personId,
		};
		// @ts-ignore
		const res = await userPoolClient.models.ArticleCast.delete(params);
		console.log(res);
	}
	console.log('delete ArticleOriginalWork =========>');
	for (let i = 0; i < article.articleOriginalWorks.length; i++) {
		const params = {
			articleId: id,
			personId: article.articleOriginalWorks[i].personId,
		};
		// @ts-ignore
		const res = await userPoolClient.models.ArticleOriginalWork.delete(params);
		console.log(res);
	}
	console.log('delete ArticleMusic =========>');
	if (article.musics) {
		for (let i = 0; i < article.musics.length; i++) {
			const params = {
				articleId: id,
				course: article.musics[i].course,
			};
			// @ts-ignore
			const res = await userPoolClient.models.ArticleMusic.delete(params);
			console.log(res);
		}
	}
	console.log('delete PageSetting =========>');
	if (article.pageSetting) {
		for (let i = 0; i < article.pageSetting.length; i++) {
			const params = {
				articleId: id,
				type: article.pageSetting[i].type,
			};
			// @ts-ignore
			const res = await userPoolClient.models.PageSetting.delete(params);
			console.log(res);
		}
	}
}

export function useColumns({
	store,
}: {
	store: QueryInfiniteStoreType<ArticleTableType[]>;
}): ColumnDef<ArticleTableType>[] {
	const conform = useConfirm();
	const { mutate: deleteArticle } = useMutation<{ id: string }>(
		async ({ id }) => {
			await deleteIntermediateTable(id);
			return userPoolClient.models.Article.delete({ id });
		},
		{
			loading: true,
			successMessage: '削除に成功しました。',
			onSuccess: () => store.query(),
		}
	);

	const { mutate: deleteIntermediate } = useMutation<{ id: string }>(
		async ({ id }) => {
			await deleteIntermediateTable(id);
			return { errors: undefined };
		},
		{
			loading: true,
			successMessage: '削除に成功しました。',
			onSuccess: () => store.query(),
		}
	);
	return [
		{
			accessorKey: 'id',
			header: 'ID',
		},
		{
			accessorKey: 'pathName',
			header: 'パス',
		},
		{
			accessorKey: 'title',
			header: '番組タイトル（シリーズ）',
		},
		{
			accessorKey: 'thumbnail.url',
			header: 'サムネイル画像',
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
							{/*<DropdownMenuItem*/}
							{/*	onClick={async () => {*/}
							{/*		const success = await modal.onOpen({ item: item });*/}
							{/*		if (success) {*/}
							{/*			store.query().then();*/}
							{/*		}*/}
							{/*	}}>*/}
							{/*	更新*/}
							{/*</DropdownMenuItem>*/}
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={async () => {
									const success = await conform.open({
										title: `「${item.sort}」を削除しますか?`,
										description: '',
										cancelText: 'キャンセル',
										confirmText: '確認',
									});
									if (success) {
										deleteArticle({ id: item.id });
									}
								}}>
								削除
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={async () => {
									const success = await conform.open({
										title: `「${item.sort}」を関連データ削除しますか?`,
										description: '',
										cancelText: 'キャンセル',
										confirmText: '確認',
									});
									if (success) {
										deleteIntermediate({ id: item.id });
									}
								}}>
								関連データ削除
							</DropdownMenuItem>
                            {['episode', 'series'].includes(item.tagType ?? '') && (
                                <DropdownMenuItem
                                    onClick={async () => {
                                        // 先行カット設定ページへ遷移
                                        window.location.href = `/article/${item.id}/advance-cut`;
                                    }}>
                                    先行カット設定
                                </DropdownMenuItem>
                            )}
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];
}
