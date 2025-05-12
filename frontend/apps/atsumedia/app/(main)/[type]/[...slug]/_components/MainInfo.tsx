import React from 'react';
import GrayTag from './GrayTag';
import OrangeBtn from './OrangeBtn';
import { Article, getCategoryByType } from '@atsumedia/data';
import MyImage from '../../../_components/MyImage';
import dynamic from 'next/dynamic';


interface MovieMainInfoProps {
	data: Article;
}

const Editor = dynamic(() => import('@atsumedia/shared-editor').then((module) => module.SharedEditor), { ssr: false });

const MainInfo: React.FC<MovieMainInfoProps> = ({ data }) => {
	// const broadcastDayTitle = useMemo(() => {
	// 	switch (data.category?.name) {
	// 		case 'movie':
	// 			return '劇場公開日';
	// 		default:
	// 			return '放送開始日';
	// 	}
	// }, [data.category]);
	const vod = data.vods.length > 0 ? data.vods[0].vod : undefined;
	console.log( data.productionCountry)
	return (
		<div className="px-1 pb-1">
			<div className="px-2">
				<h1 className="mb-2 break-all text-[21px] font-bold md:text-[29px]">{data.titleMeta}</h1>
				{/*<div className="mb-2 text-[13px]">*/}
				{/*	{broadcastDayTitle}：{data.broadcastDay}*/}
				{/*</div>*/}
				<div className="mb-2 flex w-full flex-col justify-between overflow-hidden text-[13px] md:h-auto md:overflow-visible xl:flex-row xl:space-x-1">
					<div
						className={
							'overflow-auto whitespace-nowrap md:h-auto md:w-auto md:space-x-2 md:whitespace-pre-wrap'
						}>
						<span>ジャンル</span>
						<GrayTag text={getCategoryByType(data.genreType).name} />
						{/*<span> | &nbsp;制作</span>*/}
						{/*<GrayTag text={data.distributor} />*/}
						<span>製作国</span>
						<GrayTag text={data?.productionCountry ? data.productionCountry : '日本'} /> {/*todo*/}
						{data.season?.name ? (
							<GrayTag text={`${data.season.name}${data.genreType == 'movie' ? '年' : ''}`} />
						) : null}
						{/* {data.season && <GrayTag text={data.season.name} />} */}
						{/*{data.networks.map((item) => (*/}
						{/*	<GrayTag key={item.id} text={item.dateTime} />*/}
						{/*))}{' '}*/}
						{/*todo*/}
					</div>
					<div
						className={
							'overflow-auto whitespace-nowrap md:h-auto md:w-auto md:space-x-2 md:whitespace-pre-wrap'
						}>
						<GrayTag
							text="本サイトはアフィリエイト広告を利用しています"
							className="text-[10px] text-gray-500"
						/>
					</div>
				</div>
				{data.freeTexts?.[0]?.freeText?.content ? (
					<>
						<div className={'editor mt-5 !p-0 text-[15px] md:!px-3'}>
							<Editor readOnly={true} defaultValue={data.freeTexts[0].freeText.content} />
						</div>
					</>
				) : (
					<>
						<div className="my-5 md:my-14">
							<MyImage
								alt={data.titleMeta}
								path={data.thumbnail?.url ? data.thumbnail?.url : 'public/anime/dummy_thumbnail2.png'}
								isMainImage={true}
							/>
							<p className={`mb-6 mt-[10px] break-all px-1 text-center text-[13px] font-[100]`}>
								{`${data.thumbnail?.text}${data.thumbnail && data.thumbnail.link.length > 0 && data.thumbnail.link[0] ? `(${data.thumbnail.link[0]})` : ''}`}
							</p>
						</div>
					</>
				)}
			</div>
			{vod && <OrangeBtn text={vod.name + 'で視聴する'} url={vod.url ?? ''} microcopy={vod.microcopy ?? ''} title={data.title ?? ''} />}
		</div>
	);
};

export default MainInfo;
