'use client';

import * as z from 'zod';
import {
	Button,
	ButtonLoading,
	Calendar,
	Checkbox,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Popover,
	PopoverContent,
	PopoverTrigger,
	RadioGroup,
	RadioGroupItem,
} from '@atsumedia/shared-ui';
import { Textarea } from "@atsumedia/shared-ui";
import { CalendarIcon } from 'lucide-react';
import { NewsTableType } from '@admin/(auth)/news/news-table';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@sevenvip666/react-art';
import { getTableName, userPoolClient } from '@atsumedia/amplify-client';
import React, { useState } from 'react';
import { format } from 'date-fns';
import { cn } from '@atsumedia/shared-util';
import { categoryList, CategoryType, TableName } from '@atsumedia/data';
import { useRouter } from 'next/navigation';
import '@aws-amplify/ui-react/styles.css';
import dynamic from 'next/dynamic';
import UploadImg from '@admin/(auth)/_components/upload-img';
import revalidate from '@admin/(auth)/news/actions';
import AddArticle from '@admin/(auth)/_components/add-article/add-article';
import { articleListType } from '@admin/(auth)/news/[genreType]/[id]/page';
import { nanoid } from 'nanoid';

const Editor = dynamic(() => import('@atsumedia/shared-editor').then((module) => module.SharedEditor), { ssr: false });

const profileFormSchema = z.object({
	title: z.string().min(1, 'title mast required'),
	datetime: z.string().min(1, 'title mast required'),
	genreType: z.string({
		required_error: 'genreType mast required',
	}),
	isTop: z.number({
		required_error: 'isTop mast required',
	}),
	outline: z.string().min(1, 'outline mast required'),
	isPublic: z.number({
		required_error: 'isPublic mast required',
	}),
	titleMeta: z.string().min(1, 'titleMeta mast required'),
	descriptionMeta: z.string().min(1, 'descriptionMeta mast required'),
	content: z.string().min(1, 'content mast required'),
	image: z.string().min(1, 'image mast required'),
	pathName: z
		.string()
		.regex(/[A-Za-z0-9_-]+/, 'pathName can only contain English characters, numbers, _, -')
		.min(1, 'pathName mast required'),
	author: z.object({
		name: z.string().min(1, 'author mast require'),
		image: z.string().min(1, 'authorImage mast require'),
		description: z.string().min(1, 'authorDescription mast require'),
		banner: z.string(),
	}),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

type NewsArticleType = { id: string; newsId: string; articleId: string };

type EditPageProps = {
	data: ProfileFormValues & { id?: string };
	articleList?: articleListType;
};

const EditForm: React.FC<EditPageProps> = ({ data, articleList }) => {
	const router = useRouter();
	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileFormSchema),
		defaultValues: {
			...data,
			author: data.author ?? {
				name: '',
				image: '',
				description: '',
				banner: '',
			},
		},
	});

	const [articleIdList, setArticleIdList] = useState<string[]>(articleList ? articleList.map((item) => item.id) : []);

	const isUpdate = !!data.id;

	const getArticleIdListFromParams = (body: NewsTableType & { articleIdList?: string[] }) => {
		const articleIdList = body.articleIdList;
		delete body.articleIdList;
		return articleIdList;
	};

	const saveNewsArticle = async (newsId: string, articleIdList: string[]) => {
		if (isUpdate && articleList && articleList.length > 0) {
			await userPoolClient.mutations.delNewsArticle({
				table: getTableName(TableName.NewsArticle),
				ids: articleList.map((item) => item.newsArticleId),
			});
		}
		const createNewsArticleList: NewsArticleType[] = [];
		for (const articleId of articleIdList) {
			createNewsArticleList.push({
				id: nanoid(32),
				newsId: newsId,
				articleId,
			});
		}
		await userPoolClient.mutations.putNewsArticle({
			table: getTableName(TableName.NewsArticle),
			body: JSON.stringify(createNewsArticleList),
		});
	};

	const { mutate: saveNews, isLoading: saveNewsLoading } = useMutation<NewsTableType & { articleIdList?: string[] }>(
		async (body) => {
			// Function to count the number of <a> and <img> elements
			const countTags = (html: string, tag: string) => {
				const parser = new DOMParser();
				const doc = parser.parseFromString(html, "text/html");
				return doc.getElementsByTagName(tag).length;
			};
			const aCount = countTags(body.author?.banner ?? "", "a");
			const imgCount = countTags(body.author?.banner ?? "", "img");

			if (aCount >= 5 || imgCount >= 5) {
				throw new Error("リンクまたは画像の数が制限を超えています。(最大3つまで)");
			}
			const articleIdList = getArticleIdListFromParams(body);
			const saveNewsRes = isUpdate
				? await userPoolClient.models.News.update({
						...body,
						// @ts-ignore
						datetime: new Date(body.datetime),
						id: data.id!,
						type: TableName.News,
						topPublic: `${body.isTop}-${body.isPublic}`,
						genreTypePublic: `${body.genreType}-${body.isPublic}`,
						genreTypeCopy: body.genreType,
					})
				: await userPoolClient.models.News.create({
						...body,
						// @ts-ignore
						datetime: new Date(body.datetime),
						type: TableName.News,
						topPublic: `${body.isTop}-${body.isPublic}`,
						genreTypePublic: `${body.genreType}-${body.isPublic}`,
						genreTypeCopy: body.genreType,
					});

			if (saveNewsRes.data) {
				const newsId = isUpdate ? data.id! : saveNewsRes.data.id;
				await saveNewsArticle(newsId, articleIdList ?? []);
			}
			return saveNewsRes;
		},
		{
			successMessage: isUpdate ? 'Newsを更新しました。' : 'Newsを追加しました。',
		}
	);

	const onSubmit = async (data: ProfileFormValues) => {
		// @ts-ignore
		const params = data as Partial<NewsTableType> & { articleIdList: string[] };
		params.articleIdList = articleIdList;
		const { success } = await saveNews(params);
		if (success) {
			await revalidate();
			router.push(`/news`);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>タイトル</FormLabel>
							<FormControl>
								<Input placeholder="タイトル" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="pathName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>slug(URL文字列)</FormLabel>
							<FormControl>
								<Input placeholder="slug(URL文字列)" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="datetime"
					render={({ field }) => {
						// TDOO 共通化
						const toISOStringWithTimezone = (date: Date, offsetHours: number) => {
							const offsetMilliseconds = offsetHours * 60 * 60 * 1000;
							const adjustedDate = new Date(date.getTime() + offsetMilliseconds);
							const isoString = adjustedDate.toISOString();
							return isoString.substring(0, 19); // Remove the 'Z' at the end
						};
						const date: Date = field.value ? new Date(field.value) : new Date();
						const formattedDate = toISOStringWithTimezone(date, 9);
						return (
							<FormItem className="flex flex-col">
								<FormLabel>日付</FormLabel>
								<FormControl>
									<Input
										type="datetime-local"
										defaultValue={formattedDate}
										onChange={(e) => {
											field.onChange(new Date(e.target.value).toISOString());
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)
					}}
				/>
				<FormField
					control={form.control}
					name="genreType"
					render={({ field }) => (
						<FormItem className="space-y-3">
							<FormLabel>ジャンル選択</FormLabel>
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									value={field.value}
									className="flex flex-col space-y-1">
									{categoryList.map((item) => (
										<FormItem key={item.key} className="flex items-center space-x-3 space-y-0">
											<FormControl>
												<RadioGroupItem value={item.key} />
											</FormControl>
											<FormLabel className="font-normal">{item.value.name}</FormLabel>
										</FormItem>
									))}
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="isTop"
					render={({ field }) => (
						<FormItem className="space-y-3">
							<FormLabel>TOP画面に表示</FormLabel>
							<FormControl>
								<Checkbox
									className="flex flex-col space-y-1"
									checked={field.value === 1}
									onCheckedChange={(value) => field.onChange(value ? 1 : 0)}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="outline"
					render={({ field }) => (
						<FormItem>
							<FormLabel>あらすじ</FormLabel>
							<FormControl>
								<Input placeholder="あらすじ" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="isPublic"
					render={({ field }) => (
						<FormItem className="space-y-3">
							<FormLabel>公開 / 非公開選択</FormLabel>
							<FormControl>
								<RadioGroup
									onValueChange={(value) => field.onChange(parseInt(value))}
									value={field.value === 1 ? '1' : '0'}
									className="flex">
									<FormItem className="flex items-center space-x-3 space-y-0">
										<FormControl>
											<RadioGroupItem value="1" />
										</FormControl>
										<FormLabel className="font-normal">公開</FormLabel>
									</FormItem>
									<FormItem className="flex items-center space-x-3 space-y-0">
										<FormControl>
											<RadioGroupItem value="0" />
										</FormControl>
										<FormLabel className="font-normal">非公開</FormLabel>
									</FormItem>
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="titleMeta"
					render={({ field }) => (
						<FormItem>
							<FormLabel>meta title</FormLabel>
							<FormControl>
								<Input placeholder="meta title" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="descriptionMeta"
					render={({ field }) => (
						<FormItem>
							<FormLabel>meta description</FormLabel>
							<FormControl>
								<Input placeholder="meta description" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="image"
					render={({ field }) => (
						<FormItem>
							<FormLabel>ファーストビュー画像(OGP画像としても利用)</FormLabel>
							<FormControl>
								<UploadImg isUpdate={isUpdate} value={field.value} onChange={field.onChange} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem className={'min-h-[280px] pb-8'}>
							<FormLabel>記事内容</FormLabel>
							<FormControl>
								<div className={'border rounded-md p-2'}>
									<Editor defaultValue={data.content} onChange={field.onChange} />
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="author.banner"
					render={({ field }) => (
						<FormItem className={'min-h-[220px] pb-1'}>
							<FormLabel>バナー</FormLabel>
							<FormControl>
								<Textarea {...field} defaultValue={data.author.banner} className='min-h-[170px]'></Textarea>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/*<FormField*/}
				{/*	control={form.control}*/}
				{/*	name="article"*/}
				{/*	render={({ field }) => (*/}
				{/*		<FormItem className={'min-h-[280px]'}>*/}
				{/*			<FormLabel>相关作品</FormLabel>*/}
				{/*			<FormControl>*/}
				{/*				<AddArticle isUpdate={isUpdate} value={field.value} onChange={field.onChange} />*/}
				{/*			</FormControl>*/}
				{/*			<FormMessage />*/}
				{/*		</FormItem>*/}
				{/*	)}*/}
				{/*/>*/}
				<label
					className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					htmlFor=":r3m:-form-item">
					関連作品
				</label>
				<AddArticle
					isUpdate={isUpdate}
					onChange={(value) => {
						setArticleIdList(value);
					}}
					genreType={data.genreType as CategoryType}
					articleListProp={articleList}
				/>
				<FormField
					control={form.control}
					name="author.name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>著者名</FormLabel>
							<FormControl>
								<Input placeholder="著者名" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="author.description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>著者説明文</FormLabel>
							<FormControl>
								<Input placeholder="著者説明文" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="author.image"
					render={({ field }) => (
						<FormItem>
							<FormLabel>著者画像</FormLabel>
							<FormControl>
								<UploadImg isUpdate={isUpdate} value={field.value} onChange={field.onChange} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<ButtonLoading className="float-right" type="submit" isLoading={saveNewsLoading}>
					保存
				</ButtonLoading>
			</form>
		</Form>
	);
};

export default EditForm;
