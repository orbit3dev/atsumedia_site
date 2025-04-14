import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { CategoryType } from '@atsumedia/data';
import MainPath from '../../../_components/MainPath';
import LayoutWithRight from '../../../_components/LayoutWithRight';
import AdTop from '../../../_components/AdTop';
import ArticlesDetailMain from './_components/ArticlesDetailMain';
import { getNewsData } from './lib';
import DetailRight from '../../../_components/DetailRight';
import { checkParams } from '../../../[type]/[...slug]/_utils/get-data';

type PageProps = {
	params: { type: CategoryType; slug: string };
};

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { newsData } = await getNewsData(params.slug, params.type);
	return {
		title: newsData?.titleMeta,
		description: newsData?.descriptionMeta,
		openGraph: {
			title: newsData?.titleMeta,
			type: 'website',
			description: newsData?.descriptionMeta,
			images: newsData?.image,
			locale: 'ja_JP',
		},
	};
}

const Page = async ({ params }: PageProps) => {
	const check = checkParams(params.type);
	if (!check) {
		return notFound();
	}
	const { newsData, paths } = await getNewsData(params.slug, params.type);
	if (!newsData) {
		return notFound();
	}
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'NewsArticle',
		headline: newsData.title,
		image: [newsData.image],
		datePublished: newsData.datetime,
		dateModified: newsData.updatedAt,
		author: [
			{
				'@type': 'Person',
				name: newsData.author && newsData.author.name ? newsData.author.name : 'あつめでぃあ編集部',
				// url: S3Domain + '/' + newsData.author?.image,
			},
		],
	};

	return (
		<>
			<section>
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			</section>
			<MainPath paths={paths} />
			{/*<AdTop />*/}
			<LayoutWithRight
				right={
					<DetailRight
						list={newsData!.articles ? newsData!.articles.map((item) => item.article) : []}
						title={newsData!.title}
						ad={[]}
					/>
				}>
				<ArticlesDetailMain data={newsData} />
			</LayoutWithRight>
		</>
	);
};

export default Page;
