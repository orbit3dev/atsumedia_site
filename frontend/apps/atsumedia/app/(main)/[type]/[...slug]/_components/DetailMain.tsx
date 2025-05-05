'use client';
import React, { useState } from 'react';
import MainInfo from './MainInfo';
import MainTitle from './MainTitle';
import MainText from './MainText';
import { Button } from '@atsumedia/shared-ui';
import GrayTag from './GrayTag';
import RoundGradientTitle from './RoundGradientTitle';
import H3Line from './H3Line';
import OrangeBtn from './OrangeBtn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import YoutubeEmbed from './YoutbeEmbed';
import { Article, TagType } from '@atsumedia/data';
import MyImage from '../../../_components/MyImage';
// import { getBasePath } from '../../../../_lib/config';

interface MovieDetailMainProps {
	data: Article;
	tagType: TagType;
	photographyList: Article[];
	popularityList: Article[];
	parentData: Article | null | undefined;
    showElement: boolean;
}
const DetailMain: React.FC<MovieDetailMainProps> = ({ data, tagType, photographyList, popularityList, parentData, showElement }) => {
	const [ready, setReady] = useState(false);
	const [isVideoValid, setIsVideoValid] = useState<boolean | 'private' | null>(null);
	const [videoReady, setVideoReady] = useState(false);
	const [castsLimitFlag, setCastsLimitFlag] = useState(true);
	const [castsDubLimit, setDubCastsLimit] = useState(true);
	const pathname = usePathname().split('/')[1];
	const getPlatformByUrl = (url: string) => {
		if (url.includes('twitter') || url.includes('x.com')) {
			return 'X（Twitter）';
		} else if (url.includes('instagram')) {
			return 'Instagram';
		} else if (url.includes('facebook')) {
			return 'Facebook';
		} else if (url.includes('tiktok')) {
			return 'Tiktok';
		} else {
			return url;
		}
	};
	let childs = data.childs;
	let isUsingParent = false;

	if (childs && childs.length === 0 && parentData) {
		childs = parentData.childs;
		isUsingParent = true;
	}
	childs = childs?.filter(item => item.id != data.id);

	const vods = data.vods.filter((item) => !!item.vod);

	const vod = vods.length > 0 ? vods[0].vod : undefined;

	const sns = data.sns.length > 0 ? data.sns[0].replace('x.com', 'twitter.com') : undefined;

	const [vodsShowFlag, setVodsShowFlag] = useState(false);

	const [truncateTextFlag, setTruncateTextFlag] = useState(true);

	return (
		<>
			<MainInfo data={data} />
			{showElement && (
			<MainTitle title={data.tagType == 'root' ? `${data.titleMeta}の概要` : `${data.titleMeta}のあらすじ`}>
				<MainText text={data.summary?.text ?? ''} truncateText={truncateTextFlag} />
				<p className={`mb-6 px-1 text-end text-[13px] font-[100]`}>
					{`${data.summary?.reference}${data.summary && data.summary.link.length > 0 && data.summary.link[0] ? `(${data.summary.link[0]})` : ''}`}
				</p>
				{/*<H3Line text={data.summary?.title ?? ''} />*/}
				{/*<MainText text={data.summary?.text ?? ''} />*/}
				<div className="mb-10 flex justify-center md:justify-end">
					{truncateTextFlag ? (
						<Button
							variant={'gray'}
							className="rounded-full md:text-[15px]"
							onClick={() => setTruncateTextFlag(false)}>
							もっと見る +{/*todo*/}
						</Button>
					) : (
						<Button
							variant={'gray'}
							className="rounded-full md:text-[15px]"
							onClick={() => setTruncateTextFlag(true)}>
							閉じる -{/*todo*/}
						</Button>
					)}
				</div>
			</MainTitle>
			)}

			{showElement && (
			<MainTitle className={'px-1'} title={`${data.titleMeta}の配信情報`}>
				{/*<MainText text={data.vodInfo} />*/}
				{vod && (
					<OrangeBtn text={vod.name + 'で視聴する'} url={vod.url ?? ''} microcopy={vod.microcopy ?? ''} title={data.title ?? ''} />
				)}
				{!vodsShowFlag && (
					<div className="mb-9 flex justify-center md:justify-end">
						<Button
							variant={'gray'}
							className="rounded-full md:text-[15px]"
							onClick={() => setVodsShowFlag(true)}>
							他の配信サイトを見る +{/*todo*/}
						</Button>
					</div>
				)}
				{vodsShowFlag && (
					<div className="mb-8 grid grid-cols-2 gap-x-3 gap-y-6 px-3 md:grid-cols-3 xl:grid-cols-4">
						{vods.length > 0 &&
							vods.slice(1).map((item, index) => (
								<div key={index} className="flex items-center space-x-2">
									{/*<div className="h-[62px] w-[62px] overflow-hidden rounded-full md:h-[72px] md:w-[72px]">
										<MyImage
											className="h-[62px] w-[62px] md:h-[72px] md:w-[72px]"
											path={'public/cast/dummy_cast_image.png'}
											alt={''}
										/>
									</div>*/}
									<div className={'flex-1 overflow-hidden'}>
										<div className="mb-2 truncate text-[13px] leading-[15px]">
											{/*定額見放題*/}
											{/*<br />*/}
											{/*初回30日無料*/}
											{item.vod!.microcopy}
										</div>
										{item.vod!.url ? (
											<Link href={item.vod!.url}>
												<GrayTag
													text={item.vod!.name}
													className={
														'my-0 h-[28px] max-w-full truncate px-3 text-[15px] font-[500] !leading-[28px]'
													}
												/>
											</Link>
										) : (
											<GrayTag
												text={item.vod!.name}
												className={
													'my-0 h-[28px] max-w-full truncate px-3 text-[15px] font-[500] !leading-[28px]'
												}
											/>
										)}
									</div>
								</div>
							))}
					</div>
				)}
				{vodsShowFlag && (
					<div className="mb-9 flex justify-center md:justify-end">
						<Button
							variant={'gray'}
							className="rounded-full md:text-[15px]"
							onClick={() => setVodsShowFlag(false)}>
							閉じる -{/*todo*/}
						</Button>
					</div>
				)}
			</MainTitle>
			)}

			{childs &&
				childs.length > 0 &&
				(tagType !== TagType.series ? (<MainTitle title={isUsingParent && parentData ? (parentData.tagType == 'root' ? `${parentData.titleMeta}の詳細` : `${parentData.titleMeta}のエピソード`) : (data.tagType == 'root' ? (data.genreType == 'movie' ? `${data.titleMeta}のシリーズ一覧` : `${data.titleMeta}のシリーズ一覧`) : `${data.titleMeta}の作品`)}>
					{childs.map((item) => (
						<Link href={`/${pathname}/${item.pathName}`} title={item.titleMeta} key={item.id}>
							<div className="mb-2 flex items-center rounded-md bg-[#F0F0F0] p-3 md:p-4">
								<div className={'w-[113px] shrink-0 grow-0 basis-[113px] md:w-40 md:basis-40'}>
									<MyImage
										path={
											item.thumbnail?.url
												? item.thumbnail.url
												: 'public/anime/dummy_thumbnail.png'
										}
										alt={item.titleMeta}
									/>
								</div>
								<div className="ml-2 flex-1 overflow-hidden">
									{/*<H3Arrow text={'$タイトル名$'} />*/}
									<div className="line-clamp-2 text-base font-[500] md:max-w-[750px]">
										{item.titleMeta}
									</div>
									<div className="mb-1 hidden text-justify text-[15px] font-[300] md:block">
										{data.genreType == 'movie' ? '配給:' : '制作:'}
										{/* 制作： */}
										{item.productions.length > 0 &&
											item.productions[0].production &&
											item.productions[0].production.name
											? item.productions[0].production.name
											: item.otherProduction}
									</div>
									{/*<div className="text-justify text-[15px] font-[300]">*/}
									{/*	劇場公開日：{item.broadcastDay}*/}
									{/*</div>*/}
								</div>
							</div>
						</Link>
					))}
				</MainTitle>
				) : (<MainTitle title={isUsingParent && parentData ? (data.genreType == 'movie' ? `${parentData.titleMeta}のその他のシリーズ` : `${data.titleMeta}のエピソード`) : `${data.titleMeta}のエピソード`}>
					{childs.map((item) => (
						<Link key={item.pathName} href={`/${pathname}/${item.pathName}`} title={item.titleMeta}>
							<div
								key={item.id}
								className="mb-2 flex items-center rounded-md bg-[#F0F0F0] p-3 md:p-4">
								<div className={'w-[113px] shrink-0 grow-0 basis-[113px] md:w-40 md:basis-40'}>
									<MyImage
										path={
											item.thumbnail?.url
												? item.thumbnail.url
												: 'public/anime/dummy_thumbnail.png'
										}
										alt={item.titleMeta}
									/>
								</div>
								<div className="ml-2 flex-1 overflow-hidden">
									{/*<H3Arrow text={'$タイトル名$'} />*/}
									<h3 className="line-clamp-2 text-base font-[500] md:max-w-[750px]">
										{item.titleMeta}
									</h3>
									<div className="mb-1 hidden text-justify text-[15px] font-[300] md:block">
										{data.genreType == 'movie' ? '配給:' : '制作:'}
										{/* 制作： */}
										{item.productions.length > 0 &&
											item.productions[0].production &&
											item.productions[0].production.name
											? item.productions[0].production.name
											: item.otherProduction}
									</div>
									{/*<div className="text-justify text-[15px] font-[300]">*/}
									{/*	劇場公開日：{item.broadcastDay}*/}
									{/*</div>*/}
								</div>
							</div>
						</Link>
					))}
				</MainTitle>
				))}

			{/* TODO 暂时隐藏处理，以后再开 */}
			{/*<MainTitle title={`${data.programTitle}のコメント`}>*/}
			{/*	<div className="mb-8 rounded-md border px-8 pt-8">*/}
			{/*		<MainText*/}
			{/*			text={*/}
			{/*				'コメント本文コメント本文コメント本文コメント本文コメント本文コメント本文コメント本文コメント本文コメント本文コメント本文コメント本文コメント本文コメント本文コメント本文コメント本文コメント本文コメント本文コメント本文コメント本文コメント本文コメント本文コメント本文コメント本文'*/}
			{/*			}*/}
			{/*		/>*/}
			{/*	</div>*/}
			{/*	<div className="flex justify-center md:justify-end">*/}
			{/*		<Button variant={'gray'} className="h-14 w-auto rounded-full">*/}
			{/*			<span className="mx-1 inline-flex flex-row items-center text-[15px] md:flex-col">*/}
			{/*				<div>コメントを見る</div>*/}
			{/*				<div className="px-1 text-left text-[11px] text-[#F53A50] md:px-0 md:text-xs">*/}
			{/*					{' '}*/}
			{/*					※ネタバレ有り*/}
			{/*				</div>*/}
			{/*			</span>*/}
			{/*			+*/}
			{/*		</Button>*/}
			{/*	</div>*/}
			{/*</MainTitle>*/}

			{/*<div className="my-14 grid grid-cols-2 items-center gap-2.5 px-4 md:gap-10">*/}
			{/*	<Link className="flex justify-end" href="https://abema.tv/about/premium">*/}
			{/*		<picture className="w-full overflow-hidden md:w-[300px]">*/}
			{/*			<img src={getBasePath('/image/banner/test_middle_banner_001.png')} alt={''} />*/}
			{/*		</picture>*/}
			{/*	</Link>*/}
			{/*	<Link href="https://www.hulu.jp/">*/}
			{/*		<picture className="w-full overflow-hidden md:w-[300px]">*/}
			{/*			<img src={getBasePath('/image/banner/test_middle_banner_002.png')} alt={''} />*/}
			{/*		</picture>*/}
			{/*	</Link>*/}
			{/*</div>*/}

			{isVideoValid !== false && showElement && (
				<div  style={{ display: videoReady ? 'block' : 'none' }}>
					<MainTitle className={'px-1'} title={`${data.titleMeta}の予告・告知動画`}>
						<div className="mb-10 px-2">
							<div className="relative">
								<YoutubeEmbed
									embedId={data.video?.url?.split('/').at(-1) ?? ''}
									className="mb-10 aspect-video h-auto w-full"
									onStatusChange={(status) => {
										if (status) {
											setVideoReady(true);
										}
									}}
								/>
							</div>
							{vod && (
								<OrangeBtn text={vod.name + 'で視聴する'} url={vod.url ?? ''} microcopy={vod.microcopy ?? ''} title={data.title ?? ''} />
							)}
						</div>
					</MainTitle>
				</div>
			)}

			{showElement && (
			<MainTitle title={`${data.titleMeta}のスタッフ・キャスト`}>
				<H3Line text={`${data.titleMeta}のスタッフ`} />
				<div className="my-6 flex flex-wrap">
					<span className="mb-2 mr-4 flex flex-col space-x-2 md:flex-row md:items-center">
						<RoundGradientTitle text={'監督'} />
						{data.directors.map((item, index) => (
							<GrayTag
								key={index}
								text={item.person ? item.person.name : ''}
								className={'text-[15px] font-[300]'}
							/>
						))}
					</span>
					<span className="mb-2 mr-4 flex flex-col space-x-2 md:flex-row md:items-center">
						<RoundGradientTitle text={'原作'} />
						{data.authors.map((item, index) => (
							<GrayTag
								key={index}
								text={item.person ? item.person.name : ''}
								className={'text-[15px] font-[300]'}
							/>
						))}
					</span>
					<span className="mb-2 mr-4 flex flex-col space-x-2 md:flex-row md:items-center">
						<RoundGradientTitle text={'脚本'} />
						{data.screenwriters.map((item, index) => (
							<GrayTag
								key={index}
								text={item.person ? item.person.name : ''}
								className={'text-[15px] font-[300]'}
							/>
						))}
					</span>
				</div>
				<H3Line text={`${data.titleMeta}のキャスト`} />
				<div className="my-6 mb-8 grid grid-cols-2 gap-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
					{/* <div className="my-6 mb-8 grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-4 lg:grid-cols-4"> */}
					{(castsLimitFlag ? data.casts.slice(0, 5) : data.casts).map((item, index) => (
						<div key={index} className="mb-3 flex items-center">
							<div className=" h-[62px] w-[62px] shrink-0 grow-0 basis-[62px] overflow-hidden rounded-full lg:h-[70px] lg:w-[70px] lg:basis-[70px]">
								<MyImage
									className="h-[62px] w-[62px] lg:h-[70px] lg:w-[70px]"
									path={
										item.person && item.person.image
											? item.person.image
											: 'public/cast/dummy_cast_image.png'
									}
									alt={item.person ? item.person.name : ''}
								/>
							</div>
							<div className={'max-w-full flex-1 truncate pl-2'}>
								<div className="mb-2 truncate text-[13px]">{item.roleName ?? '役名なし'}</div>
								<GrayTag
									text={item.person ? item.person.name : ''}
									className={'max-w-full truncate text-[13px] font-[300]'}
								/>
							</div>
						</div>
					))}
				</div>
				<div className="mb-14 flex justify-center md:justify-end">
					{castsLimitFlag ? (
						<Button variant={'gray'} className="h-14 rounded-full" onClick={() => setCastsLimitFlag(false)}>
							スタッフ・キャストをもっと見る +
						</Button>
					) : (
						<Button
							variant={'gray'}
							className="rounded-full md:text-[15px]"
							onClick={() => setCastsLimitFlag(true)}>
							閉じる -{/*todo*/}
						</Button>
					)}
				</div>
				{data.genreType === 'movie' && data.dubcasts?.length > 0 && (
					<>
						<H3Line text={`${data.titleMeta} 吹替キャスト`} />
						<div className="my-6 mb-8 grid grid-cols-2 gap-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
							{(castsDubLimit ? data.dubcasts.slice(0, 5) : data.dubcasts).map((item, index) => (
								<div key={index} className="mb-3 flex items-center bbb">
									<div className=" h-[62px] w-[62px] shrink-0 grow-0 basis-[62px] overflow-hidden rounded-full lg:h-[70px] lg:w-[70px] lg:basis-[70px]">
										<MyImage
											className="h-[62px] w-[62px] lg:h-[70px] lg:w-[70px]"
											path={
												item.person && item.person.image
													? item.person.image
													: 'public/cast/dummy_cast_image.png'
											}
											alt={item.person ? item.person.name : ''}
										/>
									</div>
									<div className={'max-w-full flex-1 truncate pl-2'}>
										<div className="mb-2 truncate text-[13px]">{item.roleName ?? '役名なし'}</div>
										<GrayTag
											text={item.person ? item.person.name : ''}
											className={'max-w-full truncate text-[13px] font-[300]'}
										/>
									</div>
								</div>
							))}
						</div>
						<div className="mb-14 flex justify-center md:justify-end">
							{castsDubLimit ? (
								<Button variant={'gray'} className="h-14 rounded-full" onClick={() => setDubCastsLimit(false)}>
									 吹替キャストをもっと見る +
								</Button>
							) : (
								<Button
									variant={'gray'}
									className="rounded-full md:text-[15px]"
									onClick={() => setDubCastsLimit(true)}>
									閉じる -{/*todo*/}
								</Button>
							)}
						</div>
					</>
				)}

				<div className="mb-10 flex w-full flex-col rounded-md border border-black p-4 lg:flex-row lg:pl-10">
					<div className="flex-1 lg:pr-12">
						<h2 className="break-all border-b-2 border-black py-6 text-[21px] font-bold">
							{data.titleMeta}の公式情報
						</h2>
						<div className="my-6">
							<RoundGradientTitle text={'公式サイト'} />
							<Link
								href={data.website ?? ''}
								className="ml-4 break-all text-[13px] text-[#2F8FEA]"
								target={'_blank'}
								title={'公式サイト'}>
								{data.website}
							</Link>
						</div>
						<div className="my-6">
							<RoundGradientTitle text={'公式SNS'} />
							<div className="ml-4 flex flex-wrap break-all">
								{data.sns
									.filter((item) => item)
									.map((item) => (
										<Link key={item} target={'_blank'} href={item}>
											<GrayTag
												text={getPlatformByUrl(item)}
												className={'my-1 mr-2 text-[13px]'}
											/>
										</Link>
									))}
							</div>
						</div>
						<div className="my-6">
							<p className="text-[13px]">{`${data.thumbnail?.text}${data.thumbnail && data.thumbnail.link.length > 0 && data.thumbnail.link[0] ? `(${data.thumbnail.link[0]})` : ''}`}</p>
						</div>
					</div>
					{/*{data.sns.length > 0 && <a*/}
					{/*  className="twitter-timeline"*/}
					{/*  data-width="334"*/}
					{/*  data-height="393"*/}
					{/*  href={data.sns[0].url}>*/}
					{/*  公式SNS*/}
					{/*</a>}*/}
					<div className={'w-full lg:w-[240px] lg:shrink-0 lg:grow-0 lg:basis-[300px]'}>
						{sns && (
							<TwitterTimelineEmbed
								onLoad={() => {
									setReady(true);
								}}
								options={{
									width: '100%',
									height: 400,
								}}
								sourceType="url"
								url={sns}
							/>
						)}
						{!ready && <span className="absolute">Twitter&apos;s Widget is Loading...</span>}
					</div>
				</div>
			</MainTitle>
			)}
			{/*TODO： 暂时关闭，以后再开*/}
			{/*<MainTitle title={ `${ data.programTitle }のインタビュー・コラム` } className="px-0 md:px-4">*/}
			{/*  <div className="max-h-[152px] overflow-hidden md:max-h-max md:!overflow-visible">*/}
			{/*    <div*/}
			{/*      className="flex flex-nowrap overflow-hidden overflow-x-scroll pb-4 pl-4 pr-2 pt-2 text-xs md:grid md:grid-cols-3 md:items-center md:gap-4 md:!overflow-visible md:py-0 md:pl-0">*/}
			{/*      { [1, 2, 3].map((item) => (*/}
			{/*        <CategoryListItem key={ item } />*/}
			{/*      )) }*/}
			{/*    </div>*/}
			{/*  </div>*/}
			{/*  <div className="px-4 pb-2 md:px-0">*/}
			{/*    <div className="mb-14 mt-12 flex justify-center md:justify-end">*/}
			{/*      <Button variant={ 'gray' } className="rounded-full">*/}
			{/*        インタビュー・コラムをもっと見る +*/}
			{/*      </Button>*/}
			{/*    </div>*/}

			{/*    { (data.vods?.length ?? 0) > 0 && (*/}
			{/*      <OrangeBtn*/}
			{/*        text={ data.vods![0].name + 'で視聴する' }*/}
			{/*        url={ data.vods![0].url }*/}
			{/*        microcopy={ data.vods![0].microcopy }*/}
			{/*      />*/}
			{/*    ) }*/}
			{/*  </div>*/}
			{/*</MainTitle>*/}

			{data.musics && data.musics.length > 0 && (
				<MainTitle title={`${data.titleMeta}の音楽`}>
					{data.musics.map((item, index) => (
						<div key={index}>
							<H3Line text={`第 ${index + 1} クール`} />
							<table className="my-5 w-full border-collapse border border-[#dbdbdb] text-[15px]">
								<tbody>
									<tr>
										<td className="w-[100px] border border-[#dbdbdb] bg-[#f0f0f0] p-3 text-[11px] md:w-[110px] md:text-[13px]">
											オープニング
										</td>
										<td className="border border-[#dbdbdb] p-3">
											<span className="text-[#2F8FEA]">{item.opArtist}</span> 「{item.opSong}」
										</td>
									</tr>
									<tr>
										<td className="border border-[#dbdbdb] bg-[#f0f0f0] p-3 text-[11px] md:text-[13px]">
											エンディング
										</td>
										<td className="border border-[#dbdbdb] p-3">
											<span className="text-[#2F8FEA]">{item.edArtist}</span> 「{item.edSong}」
										</td>
									</tr>
									<tr>
										<td className="border border-[#dbdbdb] bg-[#f0f0f0] p-3 text-[11px] md:text-[13px]">
											挿入歌
										</td>
										<td className="border border-[#dbdbdb] p-3">
											<span className="text-[#2F8FEA]">{item.otherArtist}</span>{' '}
											{item.otherSong ? `「${item.otherSong}」` : ''}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					))}
				</MainTitle>
			)}
			{popularityList.length > 0 && showElement && (
				<MainTitle
					title={
						data.tagType == 'root'
							? `${data.titleMeta}の人気シリーズ`
							: data.tagType == 'series'
								? `${data.titleMeta}の人気エピソード`
								: `${data.titleMeta}の人気作品`
					}
					className="px-0 md:px-4">
					<div className="max-h-[152px] overflow-hidden md:max-h-max md:!overflow-visible">
						<div className="flex flex-nowrap overflow-hidden overflow-x-scroll pb-4 pl-4 pr-2 pt-2 text-xs md:grid md:grid-cols-3 md:gap-4 md:!overflow-visible md:py-0 md:pl-0">
							{popularityList.map((item) => (
								<Link key={item.pathName} href={`/${pathname}/${item.pathName}`} title={item.titleMeta}>
									<div
										key={item.id}
										className="relative mr-2 w-[166px] transition-all duration-300 md:mr-0 md:w-auto md:min-w-1 md:hover:z-10 md:hover:!scale-110 md:hover:brightness-50">
										<div className="relative overflow-hidden rounded-lg text-[0px] leading-none">
											<MyImage
												alt={item.titleMeta}
												path={
													item?.thumbnail?.url
														? item.thumbnail.url
														: 'public/anime/dummy_thumbnail.png'
												}
											/>
											<p
												className={
													'absolute bottom-[4px] right-[4px] rounded-3xl bg-gradient-to-b from-[#226DFF] to-[#D458FF] leading-none text-white'
												}>
												<span className={'inline-block scale-50 text-[20px]'}>配信中</span>
											</p>
										</div>
										<h3 className={'mt-3 line-clamp-2 text-sm font-bold md:text-[15px]'}>
											{item.titleMeta}
										</h3>
									</div>
								</Link>
							))}
						</div>
					</div>
				</MainTitle>
			)}
			{/*<div className="my-10 grid grid-cols-2 items-center gap-2.5 px-4 md:gap-10">*/}
			{/*	<Link className="flex justify-end" href="https://abema.tv/about/premium">*/}
			{/*		<picture className="w-full overflow-hidden md:w-[300px]">*/}
			{/*			<img src={getBasePath('/image/banner/test_middle_banner_003.png')} alt={''} />*/}
			{/*		</picture>*/}
			{/*	</Link>*/}
			{/*	<Link href="https://www.hulu.jp/">*/}
			{/*		<picture className="w-full overflow-hidden md:w-[300px]">*/}
			{/*			<img src={getBasePath('/image/banner/test_middle_banner_004.png')} alt={''} />*/}
			{/*		</picture>*/}
			{/*	</Link>*/}
			{/*</div>*/}
		</>
	);
};

export default DetailMain;
