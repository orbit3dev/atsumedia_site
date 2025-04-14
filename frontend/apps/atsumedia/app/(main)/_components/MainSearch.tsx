import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import MainTitle from './MainTitle';
import { categoryList } from '@atsumedia/data';

type MainSearchProps = {
	title?: string;
	imageUrl?: string;
	bgColor?: string;
};

const MainSearch: React.FC<MainSearchProps> = ({ title, imageUrl, bgColor }) => {
	return (
		<div className={`w-full overflow-hidden ${bgColor ?? 'bg-[#f5f5f5]'}`}>
			<div className="mx-[10px] mb-[30px] mt-[30px] md:ml-[80px] md:mt-[50px]">
				{title && <MainTitle title={title} imageUrl={imageUrl} />}
				<div className="flex flex-col items-center justify-center gap-2.5 leading-[61px] text-white md:flex-row md:pr-[80px] md:leading-[77px]">
					{categoryList.map((item) => (
						<Link
							key={item.key}
							href={`/${item.value.type}`}
							style={{ backgroundColor: item.value.color }}
							className="flex w-full items-center justify-between rounded-lg px-[24px] md:w-1/4">
							<p className="text-[17px] font-bold">{item.value.name}</p>
							<p className="line-clamp-1 flex flex-1 items-center justify-end pl-2 text-[13px] leading-none">
								<span className="truncate">すべての{item.value.name}</span>
								<ChevronRight size={16} />
							</p>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default MainSearch;
