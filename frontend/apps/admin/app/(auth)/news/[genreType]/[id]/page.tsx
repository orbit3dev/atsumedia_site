import EditForm, { ProfileFormValues } from '@admin/(auth)/news/edit-form';
// import { cookieBasedClient } from '@admin/_lib/cookieBasedClient';
import NotFound from 'next/dist/client/components/not-found-error';
import { LayoutContent } from '@admin/(auth)/_components/layout-content';
import React from 'react';
import { CategoryType } from '@atsumedia/data';

export type articleListType = {
	newsArticleId: string;
	id: string;
	titleMeta: string;
	genreType: CategoryType;
	sort: number;
	parentId: string;
}[];

// const Page = async ({ params }: { params: { genreType: string; id: string } }) => {
// 	const res = await cookieBasedClient.models.News.get(
// 		{ id: params.id },
// 		{
// 			selectionSet: [
// 				'id',
// 				'title',
// 				'type',
// 				'datetime',
// 				'genreType',
// 				'genreTypeCopy',
// 				'isTop',
// 				'outline',
// 				'isPublic',
// 				'topPublic',
// 				'genreTypePublic',
// 				'titleMeta',
// 				'descriptionMeta',
// 				'content',
// 				'image',
// 				'pathName',
// 				'author.name',
// 				'author.image',
// 				'author.description',
// 				'author.banner',
// 				'articles.id',
// 				'articles.article.id',
// 				'articles.article.titleMeta',
// 				'articles.article.genreType',
// 				'articles.article.sort',
// 				'articles.article.parentId',
// 			],
// 		}
// 	);
// 	console.log('res news')
// 	console.log(res)
// 	// const list = await cookieBasedClient.models.News.list();
// 	// list.data.forEach(async (item) => {
// 	// 	await cookieBasedClient.models.News.delete({
// 	// 		id: item.id,
// 	// 	});
// 	// });
// 	if (res.data) {
// 		const articleList = res.data.articles.map((item) => {
// 			return {
// 				newsArticleId: item.id,
// 				...item.article,
// 			};
// 		}) as articleListType;
// 		// @ts-ignore
// 		const data = res.data as ProfileFormValues;
// 		return (
// 			<LayoutContent breadcrumb={[{ name: 'ニュース', href: '/news' }, { name: '編集' }]}>
// 				<EditForm data={data} articleList={articleList}></EditForm>
// 			</LayoutContent>
// 		);
// 	}
// 	return <NotFound />;
// };

// export default Page;
