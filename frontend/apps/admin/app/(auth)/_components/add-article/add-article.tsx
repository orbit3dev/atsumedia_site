import React, { FC, useEffect, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@atsumedia/shared-ui/ui/lib/ui/dialog';
import { AddArticlesTable, AddArticleTableType } from '@admin/(auth)/_components/add-article/add-article-table';
import { CategoryType } from '@atsumedia/data';
import { S3Domain } from '@atsumedia/amplify-client';
import { Button } from '@atsumedia/shared-ui';
import { articleListType } from '@admin/(auth)/news/[genreType]/[id]/page';

type AddArticleProps = {
	genreType: CategoryType;
	onChange: (value: string[]) => void;
	isUpdate: boolean;
	articleListProp?: articleListType;
};
const AddArticle: FC<AddArticleProps> = ({ isUpdate, onChange, genreType, articleListProp }) => {
	const [selectedList, setSelectedList] = useState<AddArticleTableType[]>(articleListProp ?? []);

	const selectedRowsOnChange = (selected: boolean, rows: AddArticleTableType[]) => {
		if (selected) {
			const diff = selectedList.filter((item) => rows.every((row) => row.id != item.id));
			setSelectedList([...diff, ...rows]);
		} else {
			const diff = selectedList.filter((item) =>
				rows.every((row) => {
					return row.id != item.id;
				})
			);
			setSelectedList(diff);
		}
	};

	const [articleList, setArticleList] = useState<AddArticleTableType[]>(articleListProp ?? []);

	const selectArticleOk = () => {
		setArticleList(selectedList);
		onChange(selectedList.map((item) => item.id));
	};

	const [removeFlag, setRemoveFlag] = useState(false);

	const removeArticle = (id: string) => {
		setRemoveFlag(true);
		selectedRowsOnChange(false, [{ id }] as AddArticleTableType[]);
	};

	useEffect(() => {
		if (removeFlag) {
			setArticleList(selectedList);
			onChange(selectedList.map((item) => item.id));
			setRemoveFlag(false);
		}
	}, [removeFlag, onChange, selectedList]);

	return (
		<div className={'flex min-h-[100px] w-full flex-wrap'}>
			{articleList.map((item, index) => (
				<div key={index} className={'mb-2 mr-2 flex flex-col text-center'}>
					<div className={'group relative'}>
						<img
							src={S3Domain + '/' + 'public/anime/spy_family/program_thumbnail_21000.png'}
							alt={''}
							className={'rounded-sm object-cover'}
							width={200}
						/>
						<div
							className={
								'absolute bottom-0 left-0 right-0 top-0 hidden items-center justify-center space-x-4 rounded-md border text-white group-hover:flex group-hover:bg-black/60'
							}>
							<Trash2
								onClick={() => {
									removeArticle(item.id);
								}}
								className={'hover:cursor-pointer'}
							/>
						</div>
					</div>
					<div className={'flex w-[200px] flex-wrap py-1 text-xs'}>{item.titleMeta}</div>
				</div>
			))}
			<Dialog>
				<DialogTrigger>
					<div
						className={
							'flex h-full min-h-[90px] w-[200px] items-center justify-center space-x-4 rounded-md border bg-gray-200 text-gray-700'
						}>
						<Plus className="h-7 w-7" />
					</div>
				</DialogTrigger>
				<DialogContent className={'min-w-[600px] max-w-[1000px]'}>
					<DialogHeader>
						<DialogTitle className={'mb-5'}>選ぶ関連作品</DialogTitle>
						<div>
							<AddArticlesTable
								genreType={genreType}
								selectedList={selectedList}
								selectedRowsOnChange={selectedRowsOnChange}
							/>
							<DialogFooter>
								<DialogClose>
									<Button variant={'outline'} className={'mx-2'}>
										取消
									</Button>
									<Button onClick={selectArticleOk}>确定</Button>
								</DialogClose>
							</DialogFooter>
						</div>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default AddArticle;
