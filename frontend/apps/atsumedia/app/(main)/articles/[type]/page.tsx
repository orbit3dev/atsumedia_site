import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { CategoryType, getCategoryByType } from '@atsumedia/data';
import MainPath from '../../_components/MainPath';
import LayoutWithRight from '../../_components/LayoutWithRight';
import ArticlesMain from '../_components/ArticlesMain';
import { headers } from 'next/headers';
// import { S3Domain } from '@atsumedia/amplify-client';

type PageProps = {
	params: { type: CategoryType };
};

export const revalidate = 300;

export function generateMetadata({ params }: PageProps): Metadata {
	const value = getCategoryByType(params.type);
	const headersList = headers();
	const host = headersList.get('host') || 'localhost';
	const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1');
	const protocol = isLocal ? 'http' : 'https';
	const baseUrl = `${protocol}://${host}`;
	const imagePath = '/public/anime/dummy_thumbnail.png';
	return {
		title: value?.title,
		description: value?.description,
		openGraph: {
			title: value?.title,
			type: 'website',
			description: value?.description,
			images: [`${baseUrl}${imagePath}`],
			locale: 'ja_JP',
		},
	};
}

// @ts-ignore
const Page = async ({ params }: PageProps) => {
	const value = getCategoryByType(params.type);
	if (!value) {
		return notFound();
	}

	const paths = [
		{ name: 'ニュース', path: '/articles' },
		{ name: value.name, path: `/articles/${params.type}` },
	];

	return (
		<>
			<MainPath paths={paths} />
			{/*<AdTop />*/}
			{/*<LayoutWithRight*/}
			{/*	right={*/}
			{/*		<CategoryRight*/}
			{/*			adList={[*/}
			{/*				{*/}
			{/*					imgUrl: '/image/banner/test_side_banner_001.png',*/}
			{/*					href: 'https://www.hulu.jp/',*/}
			{/*				},*/}
			{/*				{*/}
			{/*					imgUrl: '/image/banner/test_side_banner_001.png',*/}
			{/*					href: 'https://www.hulu.jp/',*/}
			{/*				},*/}
			{/*			]}*/}
			{/*		/>*/}
			{/*	}>*/}
			<LayoutWithRight>
				<ArticlesMain isCategory={true} type={params.type} />
			</LayoutWithRight>
		</>
	);
};

export default Page;
