import EditForm, { FreeTextFormValues } from '@admin/(auth)/article/[id]/advance-cut/edit-form';
// import { cookieBasedClient } from '@admin/_lib/cookieBasedClient';
import NotFound from 'next/dist/client/components/not-found-error';
import { LayoutContent } from '@admin/(auth)/_components/layout-content';
import React from 'react';
import { Article } from '@atsumedia/data';

const Page = async ({ params }: { params: { id: string } }) => {
	const res = await cookieBasedClient.models.Article.get(
		{ id: params.id },
		{
            // @ts-ignore
            selectionSet: [
                'id',
                'pathName',
                'freeTexts.id',
                'freeTexts.freeText.id',
                'freeTexts.freeText.content',
            ],
		}
	);
    if (!res.data) {
        return <NotFound />;
    }
    console.log('res free Texts')
    console.log(res)
    const article = res.data as Article;
    // @ts-ignore
    const data = article?.freeTexts?.[0]?.freeText ?? { content: '' } as FreeTextFormValues;
    return (
        <LayoutContent breadcrumb={[{ name: '作品', href: '/article' }, { name: `${article.pathName}の先行カット` }]}>
            <EditForm data={data} articleId={article.id} articleFreeTextId={article?.freeTexts?.[0]?.id}></EditForm>
        </LayoutContent>
    );
};

export default Page;
