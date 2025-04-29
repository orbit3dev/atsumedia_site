import HomeBanner from './_components/HomeBanner';
import HomeList from './_components/HomeList';
import HomeActor from './_components/HomeActor';
import React from 'react';
import { Article, TagType } from '@atsumedia/data';
import { getArticleListOrderByClickCount, getBannerList, getIsTopNewsList, getPersonList, getTopicData } from '../lib';
import { Metadata } from 'next';
// import { S3Domain } from '@atsumedia/amplify-client';

export const revalidate = 300;

export function generateMetadata(): Metadata {
	return {
		title: 'あつめでぃあ | アニメ配信情報/番組情報/メディア情報サイト',
		description:
			'『あつめでぃあ』は動画配信情報や放送日、キャスト/声優/原作者/制作会社などの番組情報を掲載している@S[アットエス]が運営する総合メディア情報サイトです。',
		openGraph: {
			title: 'あつめでぃあ | アニメ配信情報/番組情報/メディア情報サイト',
			type: 'website',
			description:
				'『あつめでぃあ』は動画配信情報や放送日、キャスト/声優/原作者/制作会社などの番組情報を掲載している@S[アットエス]が運営する総合メディア情報サイトです。',
			locale: 'ja_JP',
			images: '/public/anime/dummy_thumbnail.png',
		},
	};
}

export default async function Index() {
	const [personList, bannerList, topicData, fanGroupListDbResult, { newsList }] = await Promise.all([
		getPersonList(),
		getBannerList('public'),
		getTopicData('public'),
		getArticleListOrderByClickCount(TagType.series),
		getIsTopNewsList(10),
	]);

	type FanGroupArticle = {
		id: string;
		pathName: string;
		genreType: string;
		tagType: string;
		title: string;
		thumbnail: {
			url: string;
		};
		titleMeta: string;
		descriptionMeta: string;
		network: {
			id: string;
			name: string;
		};
	};

	type FanGroupItem = {
		yearWeek: number;
		clickCount: number;
		article: FanGroupArticle;
	};

	type ArticleWithMeta = Article & {
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
	  
	const fanGroupList = (fanGroupListDbResult as FanGroupItem[]).map((item) => {
		return {
		  ...item.article,
		  yearWeek: item.yearWeek,
		  clickCount: item.clickCount,
		};
	  }) as ArticleWithMeta[];

	  let todayTopicList: ArticleWithMeta[] = [];
	  if (fanGroupList && fanGroupList.length > 0) {
		todayTopicList = fanGroupList.slice(0, 4);
	  }
	  return (
		<>
			{bannerList.length > 0 && <HomeBanner data={bannerList} />}
			{fanGroupList.length > 0 && (
				<HomeList
					data={fanGroupList}
					title={'作品ランキング'}
					imageUrl={'/image/home/ranking-icon.svg'}
					showNumber={true}
					showNetworkName={false}
				/>
			)}

			{/*{todayTopicList.length > 0 && (*/}
			{/*	<HomeList*/}
			{/*		data={todayTopicList}*/}
			{/*		title={'今週話題のアニメ４選'}*/}
			{/*		imageUrl={'/image/home/tv-icon3.svg'}*/}
			{/*		slidesPer={3}*/}
			{/*		showNetworkName={false}*/}
			{/*	/>*/}
			{/*)}*/}
			{/*TODO: 暂时关闭，将来再开启*/}
			{/*<HomeMovies title={'今週話題の映画３選'} imageUrl={'/image/home/move-icon.svg'} />*/}
			<HomeList
				data={topicData}
				title={'ネットで話題の番組'}
				imageUrl={'/image/home/net-icon.svg'}
				showNetworkName={false}
			/>
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
					title={'ニュース'}
					imageUrl={'/image/home/net-icon.svg'}
					showNetworkName={false}
					pathNamePrefix={'/articles'}
					linkMore={'/articles?page=1'}
				/>
			)}
			{/*<HomeActor title={'注目の出演者'} imageUrl={'/image/home/vector-icon.svg'} data={personList} />*/}
		</>
	);
}
