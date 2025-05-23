'use client';
import React from 'react';
import Link from 'next/link';
import MyImage from './MyImage';
import { CategoryType } from '@atsumedia/data';
import { getBasePath } from '../../_lib/config';

interface DetailRightItemProps {
	data: ItemType;
}

export type ItemType = {
	titleMeta: string;
	pathName: string;
	title: string;
	genreType: CategoryType;
	thumbnail?: { url: string };
};

const DetailRightItem: React.FC<DetailRightItemProps> = ({ data }) => {
	const pathname = data.genreType;
	return (
		<Link key={data.pathName} href={`/${pathname}/${data.pathName}`} title={data.titleMeta}>
			<div className="flex items-center pt-2 md:flex-row">
				<div className={'mr-3 w-[166px] min-w-[166px] max-w-[166px] md:w-80 md:min-w-1'}>
					<MyImage
						alt={data.titleMeta}
						path={data.thumbnail?.url ? data.thumbnail?.url : 'public/anime/dummy_thumbnail2.png'}
					/>
				</div>
				<h3 className="flex-1 text-justify text-[14px] font-[500] decoration-solid md:ml-2 md:text-[13px]">
					{data.titleMeta}
				</h3>
			</div>
		</Link>
	);
};

export default DetailRightItem;
