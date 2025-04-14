import React from 'react';
import MainPath from '../_components/MainPath';
import CategoryBanner from './_components/CategoryBanner';
import HomeList from '../(home)/_components/HomeList';
import CategoryMain from './_components/CategoryMain';
import HomeActor from '../(home)/_components/HomeActor';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getCategoryByType, CategoryType, TagType } from '@atsumedia/data';
import { getBannerList, getNewList, getPersonList, getTopicData } from './lib';
import { getNewsListByGenreType, getRootArticleListByGenreTypeOrderByClickCount } from '../lib';
import LayoutWithRight from '../_components/LayoutWithRight';
import CategoryRight from '../_components/CategoryRight';
import AdTop from '../_components/AdTop';

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
			images: 'assets/public/anime/dummy_thumbnail.png',
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
	const { name: categoryName, color } = value;

	const [personList, bannerList, list10DbResult, topicData, newList, { newsList }] = await Promise.all([
		getPersonList(),
		getBannerList(params.type),
		getRootArticleListByGenreTypeOrderByClickCount(params.type, 10, TagType.series),
		getTopicData(params.type),
		getNewList(params.type),
		getNewsListByGenreType(params.type, 10),
	]);

	const list10 = list10DbResult.map((item) => {
		return {
			...item.article,
			yearWeek: item.yearWeek,
			clickCount: item.clickCount,
		};
	});

	return (
		<>
			<MainPath paths={[{ name: categoryName }]} />
			{bannerList.length > 0 && (
				<CategoryBanner color={color} name={categoryName} genreType={params.type} data={bannerList} />
			)}
			<div className={'mb-[25px] md:mb-[50px]'}></div>
			{/*<AdTop className={'my-2 bg-white'} />*/}
			{list10.length > 0 && (
				<HomeList
					data={list10}
					title={`${categoryName}ランキング`}
					imageUrl={'/image/home/ranking-icon.svg'}
					showNumber={true}
					showNetworkName={false}
				/>
			)}
			<HomeList
				data={topicData}
				title={`注目の${categoryName}`}
				imageUrl={'/image/home/move-icon.svg'}
				slidesPer={3}
				showNetworkName={false}
			/>
			{newList.length > 0 && (
				<LayoutWithRight>
					<CategoryMain categoryName={categoryName} data={newList} />
				</LayoutWithRight>	
			)}
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
			{/*	<CategoryMain categoryName={categoryName} data={newList} />*/}
			{/*</LayoutWithRight>*/}
			{/*<HomeActor title={'注目の声優'} imageUrl={'/image/home/vector-icon.svg'} data={personList} />*/}
			{newsList.length > 0 && (
				<HomeList
					data={newsList.map((item) => {
						return {
							titleMeta: item.title,
							genreType: item.genreType,
							pathName: item.pathName,
							thumbnail: { url: item.image },
						};
					})}
					title={`${categoryName}のニュース`}
					imageUrl={'/image/home/net-icon.svg'}
					showNetworkName={false}
					pathNamePrefix={'/articles'}
					linkMore={`/articles/${params.type}?page=1`}
				/>
			)}
		</>
	);
};

export default Page;
