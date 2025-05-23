'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css/navigation';
import Image from 'next/image';
import MainTitle from '../../_components/MainTitle';
import ListItem from '../../_components/ListItem';
import { CategoryType } from '@atsumedia/data';
import { Button } from '@atsumedia/shared-ui';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getBasePath } from '../../../_lib/config';

export type HomeListItemType = {
	titleMeta?: string;
	genreType?: CategoryType;
	pathName?: string;
	network?: { name: string };
	thumbnail?: { url: string };
    categoryId?: string;
    category?: { name: string };
};

interface HomeListProps {
	title: string;
	imageUrl?: string;
	showNumber?: boolean;
	slidesPer?: number;
	data?: HomeListItemType[];
	pathNamePrefix?: string;
	showNetworkName?: boolean;
	linkMore?: string;
	className?: string;
}

const HomeList: React.FC<HomeListProps> = ({
	title,
	imageUrl,
	showNumber,
	slidesPer,
	data,
	pathNamePrefix,
	showNetworkName = true,
	linkMore,
	className,
}) => {
	const router = useRouter();

	if (!data) {
		return <></>;
	}
	return (
		<div className={'w-full overflow-hidden'}>
			<div className={'mb-[25px] ml-[10px] mr-[30px] md:mb-[50px] md:ml-[80px]'}>
				<MainTitle title={title} imageUrl={imageUrl} />
				<Swiper
					modules={[Navigation]}
					loop={true}
					spaceBetween={10}
					slidesPerView={2}
					navigation={{
						nextEl: '.swiper-button-next',
					}}
					breakpoints={{
						641: {
							slidesPerView: slidesPer ?? 4,
						},
					}}
					className="!overflow-visible">
					{data &&
						data.map((item, index) => (
							<SwiperSlide
								key={index}
								className={
									'relative transition-all duration-300 hover:z-10 md:hover:!scale-110 md:hover:brightness-50'
								}>
								<ListItem
									data={item}
									pathNamePrefix={pathNamePrefix ?? ''}
									showNumber={showNumber}
									count={index + 1}
									networkName={item.network?.name}
									showNetworkName={showNetworkName}
									className={className}
								/>
							</SwiperSlide>
						))}
					{data && linkMore && (
						<div className="mb-16 mt-6 flex justify-center md:justify-end">
							<Button
								variant={'gray'}
								className="rounded-full md:text-[15px]"
								onClick={() => {
									router.push(linkMore);
								}}>
								ニュース一覧を見る <ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					)}
					<div className="swiper-button-next !hidden !h-[44px] !w-[44px] rounded-full bg-black/70 after:hidden md:!flex md:!h-[56px] md:!w-[56px]">
						<p className="relative h-[20px] w-[20px]">
							<Image fill src={getBasePath('/image/common/arrow.svg')} alt="arrow" />
						</p>
					</div>
				</Swiper>
			</div>
		</div>
	);
};

export default HomeList;
