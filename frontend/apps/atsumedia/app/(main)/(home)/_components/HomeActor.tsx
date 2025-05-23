'use client';
import React from 'react';
import Image from 'next/image';
import MainTitle from '../../_components/MainTitle';
import GrayTag from '../../[type]/[...slug]/_components/GrayTag';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css/navigation';
import { Person } from '@atsumedia/data';
import MyImage from '../../_components/MyImage';
import { getBasePath } from '../../../_lib/config';

interface HomeActorProps {
	title: string;
	imageUrl?: string;
	data?: Person[];
}

const HomeActor: React.FC<HomeActorProps> = ({ title, imageUrl, data }) => {
	return (
		<div className={'w-full overflow-hidden'}>
			<div className={'mb-[25px] ml-[10px] mr-[30px] md:mb-[50px] md:ml-[80px]'}>
				<MainTitle title={title} imageUrl={imageUrl} />
				<Swiper
					modules={[Navigation]}
					loop={false}
					spaceBetween={10}
					slidesPerView={'auto'}
					navigation={{
						nextEl: '.swiper-button-next',
					}}
					className="!overflow-visible">
					{data &&
						data.map((item) => (
							<SwiperSlide
								key={item.name}
								className={
									'relative !w-[72px] transition-all duration-300 hover:z-10 md:!w-[139px] md:hover:!scale-110'
								}>
								<div className="text-center">
									<MyImage
										visibleByDefault={true}
										path={item.image ? item.image : 'public/cast/dummy_cast_image.png'}
										alt={''}
										className="m-auto h-[72px] w-[72px] overflow-hidden rounded-full md:h-[139px] md:w-[139px]"
									/>
									<div className="mt-2 md:mt-3">
										<GrayTag
											text={item.name}
											className={
												'max-w-[72px] truncate bg-transparent px-0.5 text-[13px] font-[300] text-black md:max-w-[139px] md:bg-[#f0f0f0] md:px-3 md:text-[15px] md:text-[#5a75ff]'
											}
										/>
									</div>
								</div>
							</SwiperSlide>
						))}
					<div className="swiper-button-next !-mt-[48px] !hidden !h-[44px] !w-[44px] rounded-full bg-black/70 after:hidden md:!flex md:!h-[56px] md:!w-[56px]">
						<p className="relative h-[20px] w-[20px]">
							<Image fill src={getBasePath('/image/common/arrow.svg')} alt="arrow" />
						</p>
					</div>
				</Swiper>
			</div>
		</div>
	);
};

export default HomeActor;
