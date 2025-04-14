import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { CategoryType, getCategoryByType } from '@atsumedia/data';
import MainPath from '../../_components/MainPath';
import LayoutWithRight from '../../_components/LayoutWithRight';
import ArticlesMain from '../_components/ArticlesMain';
import CategoryRight from '../../_components/CategoryRight';
import AdTop from '../../_components/AdTop';
import { S3Domain } from '@atsumedia/amplify-client';

type PageProps = {
	params: { type: CategoryType };
};

export const revalidate = 300;

export function generateMetadata({ params }: PageProps): Metadata {
	const value = getCategoryByType(params.type);
	return {
		title: value?.title,
		description: value?.description,
		openGraph: {
			title: value?.title,
			type: 'website',
			description: value?.description,
			images: S3Domain + '/public/anime/dummy_thumbnail.png',
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
