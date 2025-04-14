import React from 'react';
import { Article, CategoryType, TagType } from '@atsumedia/data';
import {
	getCategoryRootList,
	getCategorySeriesList,
	getEpisodeList,
	getOtherEpisodeList,
	getSeriesList,
} from '../../lib';
import DetailRight from '../../../_components/DetailRight';
import { unstable_cache } from 'next/cache';

interface MovieDetailRightProps {
	article: Article;
}

const getRightDataList = unstable_cache(
	async (article: Article) => {
		const articleList: Article[] = [];
		if (article!.tagType == TagType.root) {
			const categoryRootList = await getCategoryRootList(article!, 4, article!.genreType as CategoryType);
			if (categoryRootList && categoryRootList.length > 0) {
				articleList.push(...categoryRootList.filter((item) => item.id != article!.id));
			}
		} else if (article!.tagType == TagType.series) {
			const seriesList = await getSeriesList(article!.parent?.pathName ?? '', 4);
			if (seriesList && seriesList.length > 0 && seriesList.filter((item) => item.id != article!.id).length > 0) {
				articleList.push(...seriesList.filter((item) => item.id != article!.id));
			} else {
				const categorySeriesList = await getCategorySeriesList(article!, 4);
				if (categorySeriesList && categorySeriesList.length > 0) {
					articleList.push(...categorySeriesList.filter((item) => item.id != article!.id));
				}
			}
		} else if (article!.tagType == TagType.episode) {
			const episodeList = await getEpisodeList(article!.parent?.pathName ?? '', 4);
			if (
				episodeList &&
				episodeList.length > 0 &&
				episodeList.filter((item) => item.id != article!.id).length > 0
			) {
				articleList.push(...episodeList.filter((item) => item.id != article!.id));
			} else {
				const otherEpisodeList = await getOtherEpisodeList(article!, 4);
				if (otherEpisodeList && otherEpisodeList.length > 0) {
					articleList.push(...otherEpisodeList.filter((item) => item.id != article!.id));
				}
			}
		}
		return articleList;
	},
	['listByPathNameRight'],
	{ revalidate: 30 }
);

const DetailRightProvider: React.FC<MovieDetailRightProps> = async ({ article }) => {
	const articleList = await getRightDataList(article);
	return (
		<DetailRight
			list={articleList}
			title={article!.titleMeta}
			ad={[
				{
					imgUrl: '/image/banner/test_side_banner_001.png',
					href: 'https://www.hulu.jp/',
				},
				{
					imgUrl: '/image/banner/test_side_banner_002.png',
					href: 'https://abema.tv/about/premiu',
				},
			]}
		/>
	);
};

export default DetailRightProvider;
