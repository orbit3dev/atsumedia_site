import React from 'react';
import { Metadata } from 'next';
import MainPath from '../_components/MainPath';
import LayoutWithRight from '../_components/LayoutWithRight';
import ArticlesMain from './_components/ArticlesMain';
import CategoryRight from '../_components/CategoryRight';
import AdTop from '../_components/AdTop';

export const revalidate = 300;

export function generateMetadata(): Metadata {
	return {
		title: 'ニュース',
		description: 'ニュース',
		openGraph: {
			title: 'ニュース',
			type: 'website',
			description: 'ニュース',
			images: '/public/anime/dummy_thumbnail.png',
			locale: 'ja_JP',
		},
	};
}

const Page = () => {
	const paths = [{ name: 'ニュース', path: '/articles' }];

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
				<ArticlesMain />
			</LayoutWithRight>
		</>
	);
};

export default Page;
