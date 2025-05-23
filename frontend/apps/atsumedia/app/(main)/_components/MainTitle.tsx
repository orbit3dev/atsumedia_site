import React from 'react';
import 'swiper/css/pagination';
import Image from 'next/image';
import { getBasePath } from '../../_lib/config';

interface MainTitleProps {
	title: string;
	imageUrl?: string;
}

const MainTitle: React.FC<MainTitleProps> = ({ title, imageUrl }) => {
	return (
		<h2 className="mb-[15px] flex items-center text-[20px] font-bold leading-10 md:text-[22px]">
			<span className="relative mr-[10px] inline-block h-[22px] w-[22px] shrink-0 grow-0 basis-[22px]">
				<Image fill src={getBasePath(imageUrl ?? '/image/home/ranking-icon.svg')} alt="" />
			</span>
			{title}
		</h2>
	);
};

export default MainTitle;
