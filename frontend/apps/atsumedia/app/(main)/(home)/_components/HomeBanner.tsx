'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import React, { useRef } from 'react';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { ChevronRight } from 'lucide-react';
import { Swiper as SwiperClass } from 'swiper/types';
import { PageSetting, getCategoryByType } from '@atsumedia/data';
import Link from 'next/link';
import MyImage from '../../_components/MyImage';

interface HoneBannerProps {
	data: PageSetting[];
}

const HomeBanner: React.FC<HoneBannerProps> = ({ data }) => {
	const progressLine = useRef<HTMLSpanElement | null>(null);
	const onAutoplayTimeLeft = (_: SwiperClass, __: number, progress: number) => {
		progressLine?.current?.style.setProperty('width', `${(1 - progress) * 100}%`);
	};
	const getPath = (data: PageSetting) => {
		if (data.article) {
			return `/${data.article.genreType}/${data.article.pathName}`;
		} else {
			return '/';
		}
	};

	return (
		<div className={'relative mb-[25px] w-full md:mb-[64px]'}>
			<div className="z-1 absolute bottom-0 h-4/6 w-full bg-black"></div>
			<Swiper
				modules={[Autoplay, EffectCoverflow]}
				onAutoplayTimeLeft={onAutoplayTimeLeft}
				loop
				centeredSlides
				effect="coverflow"
				coverflowEffect={{
					slideShadows: false,
					rotate: 0,
					scale: 0.9,
					stretch: -5,
				}}
				speed={2000}
				autoplay={{
					delay: 3000,
					stopOnLastSlide: false,
					disableOnInteraction: false,
					reverseDirection: false,
				}}
				breakpoints={{
					641: {
						slidesPerView: 2,
					},
					640: {},
				}}>
				{data &&
					data.map((item, index) => (
						<SwiperSlide key={index} className={'relative'}>
							<Link href={getPath(item)}>
								<MyImage
									path={
										item.article?.thumbnail?.url
											? item.article.thumbnail.url
											: 'public/anime/dummy_thumbnail2.png'
									}
									visibleByDefault={true}
									alt={item.article ? item.article.titleMeta : ''}
								/>
								<div
									className={
										'absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-black to-transparent'
									}></div>
								<div className="absolute bottom-[5px] left-[20px] right-[20px] h-16">
									<div className="flex items-center justify-start text-[18px] text-white md:text-[21px]">
										<h3 className="line-clamp-2 md:line-clamp-1">{item.article?.titleMeta}</h3>
										<span className="inline-block w-4 text-left">
											<ChevronRight size={16} />
										</span>
									</div>
								</div>
								<p
									className={`absolute right-[8px] top-[8px] rounded-3xl ${item.article ? `bg-[${getCategoryByType(item.article.genreType).color}]` : ''} px-2.5 text-center text-xs leading-[25px] text-white`}>
									{item.article ? getCategoryByType(item.article.genreType).name : ''}
								</p>
							</Link>
						</SwiperSlide>
					))}
				<div
					className="autoplay-progress absolute bottom-0 z-10 h-[6px] w-full text-center text-[0] leading-none md:h-2"
					slot="container-end">
					<p className="m-auto h-[6px] w-full md:h-2 md:w-1/2">
						<span
							className="block h-full rounded-full bg-gradient-to-r from-[#226DFF] to-[#D458FF]"
							ref={progressLine}></span>
					</p>
				</div>
			</Swiper>
		</div>
	);
};

export default HomeBanner;
