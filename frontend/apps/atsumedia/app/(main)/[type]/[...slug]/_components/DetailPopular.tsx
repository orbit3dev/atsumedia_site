import React from 'react';
import { ChevronRight } from 'lucide-react';
import MainTitle from '../../../_components/MainTitle';
import { Article, CategoryType, KeyValue, TagType } from '@atsumedia/data';
import Link from 'next/link';
import MyImage from '../../../_components/MyImage';
import { unstable_cache } from 'next/cache';
import { getRootArticleListByGenreTypeOrderByClickCount } from '../../../lib';

type MoviePopularProps = {
	data?: Article[];
	category: KeyValue;
};

type ArticlesData = {
	id: string;
	pathName: string;
	genreType: string;
	tagType: string;
	title: string;
	thumbnail: { url: string }; // You can expand this based on the real structure
	titleMeta: string;
	descriptionMeta: string;
	network: { id: string; name: string }; // Adjust according to actual structure
};

type TopListItem = {
	yearWeek: number;
	clickCount: number;
	article: ArticlesData;
};

type Thumbnail = {
	url: string;
};

// Define the structure of the `network` object
type Network = {
	id: string;
	name: string;
};

// Define the structure of the `dataMainTitle` object
type DataMainTitle = {
	id: string;
	pathName: string;
	genreType: string;
	tagType: string;
	title: string;
	thumbnail: Thumbnail;
	titleMeta: string;
	descriptionMeta: string;
	network: Network;
	yearWeek: number;
	clickCount: number;
};

type TopListDbResult = TopListItem[];
const getTopList = unstable_cache(
	async (categoryType: CategoryType) => {
		const topListDbResult = await getRootArticleListByGenreTypeOrderByClickCount(
			categoryType,
			6,
			TagType.series
		);
		return topListDbResult.map((item: TopListItem) => {
			return {
				...item.article,
				yearWeek: item.yearWeek,
				clickCount: item.clickCount,
			};
		});
	},
	['listByPathNameDetailTop'],
	{ revalidate: 300 }
);

const DetailPopular: React.FC<MoviePopularProps> = async ({ category }) => {
	const categoryType = category.key as CategoryType;
	const data = await getTopList(categoryType);
	const getPath = ({ genreType, pathName }: { genreType: string; pathName: string }) => {
		return `/${genreType}/` + pathName;
	};
	if (data.length == 0) {
		return <></>;
	}
	return (
		<div className="mx-auto mb-[25px] max-w-[1600px] px-3 pr-0 pt-4 md:mb-[50px] md:px-[80px] md:pr-4 md:pt-10">
			<MainTitle title={`現在人気の${category.value}`} imageUrl={'/image/home/move-icon.svg'} />
			<div className="overflow-hidden md:!overflow-visible">
				<div className="ml-[10px] flex flex-nowrap overflow-hidden overflow-x-scroll pr-2 text-xs md:ml-0 md:grid md:grid-cols-3 md:gap-2 md:!overflow-visible">
					{data!.map((item: DataMainTitle) => (
						<Link key={item.id} href={getPath({ genreType: item.genreType, pathName: item.pathName })}>
							<div key={item.id} className="mr-2 md:mr-0">
								<div className="relative min-w-[166px] overflow-hidden rounded-md transition-all duration-300 md:hover:z-10 md:hover:!scale-110 md:hover:brightness-50">
									<MyImage
										alt={item.titleMeta}
										path={
											item.thumbnail?.url
												? item.thumbnail?.url
												: 'public/anime/dummy_thumbnail.png'
										}
									/>
									<div className="absolute bottom-0 left-0 h-1/3 w-full bg-gradient-to-t from-black to-transparent"></div>
									<div className="absolute bottom-1 right-1 flex items-center justify-between md:bottom-[8px] md:left-0 md:right-0 md:w-full">
										<div className="text-md hidden w-full flex-1 items-center justify-start px-[10px] py-[5px] text-[15px] font-bold text-white md:flex">
											<h3 className="line-clamp-2">{item.titleMeta}</h3>
											<span className="inline-block w-4 text-left">
												<ChevronRight size={16} />
											</span>
										</div>
										{/*<p className="mr-0 flex h-[20px] items-center justify-center rounded-xl bg-gradient-to-b from-[#226DFF] to-[#D458FF] px-1 text-center text-[10px] text-white md:mr-[10px] md:h-[31px] md:w-[74px] md:rounded-3xl md:text-sm">
												配信中
											</p>*/}
									</div>
								</div>
								<h3 className="mt-2 line-clamp-2 md:hidden">{item.titleMeta}</h3>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default DetailPopular;
