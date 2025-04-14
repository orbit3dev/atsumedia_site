import React from 'react';
import { CategoryType } from '@atsumedia/data';
import { notFound } from 'next/navigation';
import DetailContent from './_components/DetailContent';
import MainPath from '../../_components/MainPath';
import { Metadata } from 'next';
import StatisticClickCount from './_components/StatisticClickCount';
import { checkParams, getResultData } from './_utils/get-data';

type PageProps = {
	params: { type: CategoryType; slug: string[] };
};
export const revalidate = 300;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const check = checkParams(params.type);
	if (!check) {
		return {};
	}
	const { data } = await getResultData(params);

	return {
		title: data?.titleMeta,
		description: data?.descriptionMeta,
		openGraph: {
			title: data?.titleMeta,
			type: 'website',
			description: data?.descriptionMeta,
			images: '/public/anime/dummy_thumbnail.png',
			locale: 'ja_JP',
		},
	};
}


const Page = async ({ params }: PageProps) => {
	const check = checkParams(params.type);
	if (!check) {
		return notFound();
	}
	const { paths, targetCategory, data, parentData } = await getResultData(params);
	if (!data) {
		return notFound();
	}

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: data.titleMeta,
		image: [data.thumbnail?.url],
		datePublished: data.createdAt,
		dateModified: data.updatedAt,
		author: data.authors.map((item) => {
			return {
				'@type': 'Person',
				name: item.person?.name,
				// url: S3Domain + '/' + item.person.image,
			};
		}),
	};

	return (
		<>
			<section>
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			</section>
			<MainPath paths={paths} />
			<DetailContent category={targetCategory} tagType={data.tagType} data={data} parentData={parentData} />
			<StatisticClickCount data={data} />
		</>
	);
};

export default Page;
