import React from 'react';
import Link from 'next/link';
import { Article } from '@atsumedia/data';
import MyImage from '../../_components/MyImage';

interface MovieListItemProps {
	data?: Article;
	visibleByDefault?: boolean;
}

const CategoryListItem: React.FC<MovieListItemProps> = ({ data, visibleByDefault }) => {
	const getPath = (data?: Article) => {
		return `/${data?.genreType}/` + data?.pathName;
	};
	return (
		<Link href={getPath(data)}>
			<div className="relative mr-2 transition-all duration-300 md:hover:z-10 md:hover:!scale-110 md:hover:brightness-50">
				<div className="relative">
					<MyImage
						visibleByDefault={visibleByDefault}
						path={data?.thumbnail?.url ? data.thumbnail.url : 'public/anime/dummy_thumbnail2.png'}
						alt={data?.titleMeta ?? ''}
					/>
					<p
						className={
							'absolute bottom-[4px] right-[4px] rounded-3xl bg-gradient-to-b from-[#226DFF] to-[#D458FF] leading-none text-white'
						}>
						<span className={'inline-block scale-50 text-[20px]'}>配信中</span>
					</p>
				</div>
				<p className={'mt-3 line-clamp-2 max-w-full text-sm font-bold md:text-[15px]'}>{data?.titleMeta}</p>
			</div>
		</Link>
	);
};

export default CategoryListItem;
