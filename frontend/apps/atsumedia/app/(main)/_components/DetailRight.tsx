import React from 'react';
import Link from 'next/link';
import DetailRightItem, { ItemType } from './DetailRightItem';
import { getBasePath } from '../../_lib/config';

type DetailRightProps = {
	title: string;
	ad: { imgUrl: string; href: string }[];
	list: ItemType[];
};

const DetailRight: React.FC<DetailRightProps> = async ({ title, list, ad }) => {
	const adTop = ad.length > 0 ? ad[0] : undefined;
	const otherAdList = ad.filter((_, index) => index != 0);
	// console.log(list);
	return (
		<>
			{adTop && (
				<div className="mb-10 mt-10 grid hidden grid-cols-2 items-center gap-2 md:mt-0 md:block md:grid-cols-1 md:gap-y-10">
					<Link href={adTop.href}>
						<picture className="w-full overflow-hidden rounded-md md:w-[300px]">
							<img className="m-auto" src={getBasePath(adTop.imgUrl)} alt={''} />
						</picture>
					</Link>
				</div>
			)}
			{list.length > 0 && (
				<div className="mt-7 pb-3 pt-1 md:mt-0">
					<h2 className="flex items-center text-[17px] font-bold">
						<picture className="mr-1 w-3 md:w-3">
							<img src={getBasePath('/image/common/arrow.png')} alt={''} />
						</picture>
						<span className={'flex-1'}>{title}関連作品</span>
					</h2>
					{list.map((item) => (
						<DetailRightItem key={item.pathName} data={item} />
					))}
				</div>
			)}
			{otherAdList.map((item, index) => {
				<div key={item.href + index} className="mt-7 hidden md:block">
					<Link href={item.href}>
						<picture className="w-full overflow-hidden text-center md:w-[300px]">
							<img className="m-auto" src={getBasePath(item.imgUrl)} alt={''} />
						</picture>
					</Link>
				</div>;
			})}
		</>
	);
};

export default DetailRight;
