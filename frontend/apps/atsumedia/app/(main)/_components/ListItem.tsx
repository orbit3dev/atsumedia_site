import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getCategoryByType } from '@atsumedia/data';
import { HomeListItemType } from '../(home)/_components/HomeList';
import MyImage from './MyImage';
import { getBasePath } from '../../_lib/config';

type ListItemProps = {
	showNumber?: boolean;
	count: number;
	data: HomeListItemType;
	pathNamePrefix: string;
	networkName?: string;
	showNetworkName?: boolean;
	className?: string;
};

const ListItem: React.FC<ListItemProps> = ({
	showNumber,
	count,
	data,
	pathNamePrefix,
	networkName,
	showNetworkName,
	className,
}) => {
	const getPath = () => {
		if (data.genreType && data.pathName) {
			return `${pathNamePrefix}/${data.genreType}/${data.pathName}`;
		} else {
			return `/`;
		}
	};

	return (
		<Link href={getPath()}>
			<div className={'relative w-full'}>
				<MyImage
					className={className}
					visibleByDefault={true}
					path={data.thumbnail?.url ? data.thumbnail.url : 'public/anime/dummy_thumbnail1.png'}
					alt={data.titleMeta ?? ''}
				/>
				{showNumber && (
					<div className={'absolute -top-[13px] left-[4px]'}>
						<p className="relative h-[36px] w-[36px]">
							<Image
								fill
								src={getBasePath(
									count == 1
										? '/image/home/ranking-icon-number1.svg'
										: count == 2
											? '/image/home/ranking-icon-number2.svg'
											: count == 3
												? '/image/home/ranking-icon-number3.svg'
												: '/image/home/ranking-icon-number.svg'
								)}
								alt="ranking"
							/>
						</p>
						<p
							className={
								'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-base font-bold text-white'
							}>
							{count ?? 1}
						</p>
					</div>
				)}
                <p
                    className={'absolute right-[4px] top-[4px] rounded-3xl leading-none text-white'}
                    style={{ backgroundColor: data.genreType ? getCategoryByType(data.genreType).color : '' }}
                >
					<span className={'inline-block scale-50 text-[20px]'}>
						{data.genreType ? getCategoryByType(data.genreType).name : ''}
					</span>
				</p>
			</div>
			{/*<p
        className={'absolute top-[4px] right-[4px] bg-[#ab58ff] text-white rounded-3xl leading-none'}>
        <span className={'inline-block text-[20px] scale-50'}>ドラマ</span></p>*/}
			<h3 className={'mt-3 line-clamp-2 text-[14px] font-bold md:text-[15px]'}>
				{data.titleMeta ? data.titleMeta : ''}
			</h3>
			{showNetworkName && <p className={'text-[11px] text-[#666666]'}>{networkName ?? ''}</p>}
		</Link>
	);
};

export default ListItem;
