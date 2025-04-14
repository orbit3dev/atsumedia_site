import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBasePath } from '../../_lib/config';

const CommonFooter = () => {
	return (
		<>
			<div className="m-auto max-w-[990px]">
				<div className="hidden gap-[60px] px-[8px] py-[30px] md:flex">
					<dl>
						<dt className="mb-[12px] font-bold">
							<a href="https://shizushinsbs.co.jp/" target="_blank">
								企業情報
							</a>
						</dt>
						<dd>
							<ul className="flex flex-col gap-y-1 text-[14px]">
								<li>
									<a href="https://shizushinsbs.co.jp/recruit" target="_blank">
										採用情報
									</a>
								</li>
								<li>
									<a href="https://shizushinsbs.co.jp/group/" target="_blank">
										グループ会社・関連団体
									</a>
								</li>
								<li>
									<a href="https://www.at-s.com/saigai/" target="_blank">
										静岡新聞SBS災害情報
									</a>
								</li>
								<li>
									<a href="https://www.at-s.com/info/kengaku/" target="_blank">
										新聞・テレビ・ラジオ見学
									</a>
								</li>
								<li>
									<a href="https://shizushinsbs.co.jp/news/" target="_blank">
										プレスリリース
									</a>
								</li>
								<li>
									<a href="https://shizushinsbs.co.jp/sdgs/" target="_blank">
										SDGsへの取り組み
									</a>
								</li>
							</ul>
						</dd>
					</dl>
					<dl>
						<dt className="mb-[12px] font-bold">静岡新聞SBSへの情報提供</dt>
						<dd>
							<ul className="flex flex-col gap-y-1 text-[14px]">
								<li>
									<a href="http://www.at-s.com/info/traffic.html">静岡新聞SBSに投稿</a>
								</li>
								<li>
									<a href="http://www.at-s.com/info/weeklyguide.html">
										ウィークリーガイド掲載申し込み
									</a>
								</li>
							</ul>
						</dd>
					</dl>
					<dl>
						<dt className="mb-[12px] font-bold">購読・サービスのご案内</dt>
						<dd>
							<ul className="flex flex-col gap-y-1 text-[14px]">
								<li>
									<a href="http://www.at-s.com/info/koudoku/index.html">新聞購読・試読</a>
								</li>
								<li>
									<a href="https://www.at-s.com/apps/shop/backno_daily">バックナンバー</a>
								</li>
								<li>
									<a href="http://www.at-s.com/book/">静岡新聞の本</a>
								</li>
								<li>
									<a href="https://support.at-s.com/" target="_blank">
										＠S［アットエス］ストア
									</a>
								</li>
							</ul>
						</dd>
					</dl>
					<dl>
						<dt className="mb-[12px] font-bold">法人のお客様へ</dt>
						<dd>
							<ul className="flex flex-col gap-y-1 text-[14px]">
								<li>
									<a href="https://shizushin.jp/" target="_blank">
										静岡新聞データベース
									</a>
								</li>
							</ul>
						</dd>
					</dl>
				</div>
				<div
					className={
						'flex flex-col-reverse items-center gap-[10px] border-t py-[10px] md:flex-row md:items-start md:gap-0'
					}>
					<ul className={'flex flex-wrap items-start divide-x text-[14px]'}>
						<li className={'my-1.5 px-2 leading-none'}>
							<Link key={'terms'} href={'/terms'} className={'text-[#686b6d] hover:text-black'}>
								利用規約
							</Link>
						</li>
						<li className={'my-1.5 px-2 leading-none'}>
							<a
								className={'text-[#686b6d] hover:text-black'}
								href="https://www.at-s.com/info/copyright.html">
								著作権
							</a>
						</li>
						<li className={'my-1.5 px-2 leading-none'}>
							<Link href={'/contact'} className={'text-[#686b6d] hover:text-black'}>
								お問い合わせ
							</Link>
						</li>
						<li className={'my-1.5 px-2 leading-none'}>
							<a
								className={'text-[#686b6d] hover:text-black'}
								target="_blank"
								href="https://shizushinsbs.co.jp/corporate">
								運営元情報
							</a>
						</li>
					</ul>
					<div className="flex gap-[10px] md:ml-[96px] md:mt-[26px] md:gap-[20px]">
						<Link href={'/'}>
							<Image
								src={getBasePath('/image/common/atsumedia_logo_footer.png')}
								width={150}
								height={44}
								alt="あつめでぃあ | アニメ配信情報/番組情報/メディア情報サイト"
							/>
						</Link>
						<a href={'https://www.at-s.com/'} target="_blank">
							<Image
								src={getBasePath('/image/common/shizuoka-news.png')}
								width={141}
								height={33}
								alt="静岡新聞 SBS"
							/>
						</a>
					</div>
				</div>
			</div>
			<div className={'w-full bg-[#404040] px-2 py-3 text-center text-[11px] text-white'}>
				&copy;The Shizuoka Shimbun and Shizuoka Broadcasting System., All rights reserved.
			</div>
		</>
	);
};

export default CommonFooter;
