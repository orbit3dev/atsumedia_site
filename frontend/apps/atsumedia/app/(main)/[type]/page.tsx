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
import { headers } from 'next/headers';


type PageProps = {
	params: { type: CategoryType };
};

type Network = {
	id: string;
	name: string;
};

type Thumbnail = {
	url: string;
};

type Article = {
	id: string;
	pathName: string;
	genreType: string;
	tagType: string;
	title: string;
	thumbnail: Thumbnail;
	titleMeta: string;
	descriptionMeta: string;
	network: Network;
};

type List10DbResultItem = {
	yearWeek: number;
	clickCount: number;
	article: Article;
};

type ArticleWithStats = Article & {
	yearWeek: number;
	clickCount: number;
};

type HomeListItemType = {
	id: string;
	pathName: string;
	title: string;
	titleMeta: string;
	descriptionMeta: string;
	thumbnail: {
		url: string;
	};
	network: {
		id: string;
		name: string;
	};
	tagType: string;
	genreType: string; // ← this is the fix (was: CategoryType | undefined)
	yearWeek: number;
	clickCount: number;
};

type NewsItem = {
	id: number;
	title: string;
	type: string;
	genreType: string;
	titleMeta: string;
	description_meta: string;
	image: string;
	pathName: string;
	author: string;
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
	const { name: categoryName, color } = value;
	const [personList, bannerList, list10DbResult, topicData, newList, { newsList }] = await Promise.all([
		getPersonList(),
		getBannerList(categoryName),
		getRootArticleListByGenreTypeOrderByClickCount(params.type, 10, TagType.series),
		getTopicData(categoryName),
		getNewList(params.type),
		getNewsListByGenreType(params.type, 10),
	]);
	const list10 = (list10DbResult as List10DbResultItem[]).map((item) => ({
		...item.article,
		yearWeek: item.yearWeek,
		clickCount: item.clickCount,
		genreType: item.article.genreType as CategoryType,
	}));
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
					data={newsList.map((item: NewsItem) => {
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
