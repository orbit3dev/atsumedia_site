import MainHeader from './(main)/_components/MainHeader';
import MainFooter from './(main)/_components/MainFooter';
import React from 'react';
import { getBasePath } from './_lib/config';

/**
 * 404
 * @constructor
 */
const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
const img_location = (MAINTENANCE_MODE  == true) ? '503' : '404';
const text_caption = (MAINTENANCE_MODE  == true) 
	? 'ご不便をおかけしますが、復旧までしばらくお待ちください。' 
	: 'このサイトには、下記のようなコンテンツが用意されているので、ご覧ください 。'
const title_caption = (MAINTENANCE_MODE == true)
	? 'メンテナンス中のため、現在サービスをご利用いただけません。'
	: 'お探しのページは見つかりませんでした。'
	const class_name = (MAINTENANCE_MODE == true)
	? 'mb-10 mt-10 w-2/4 md:mb-[0px] md:w-1/3'
	: 'mb-10 mt-10 w-2/4 md:mb-[72px] md:w-auto'
export default async function ErrorPage() {
	return (
		<main className="flex h-[100vh] flex-col">
			<MainHeader />
			<div className="flex flex-1 flex-col scroll-auto">
				<div className="flex flex-1 flex-col items-center justify-center">
					<picture className={class_name}>
						<img src={getBasePath(`/image/common/${img_location}.png`)} alt={`img_location`} />
					</picture>
					<p className="px-4 text-sm font-bold md:text-[17px]">{title_caption}</p>
					<p className="mb-[64px] px-4 text-sm font-bold md:text-[17px]">
						{`${text_caption}`}
					</p>
				</div>
				{ <MainFooter searchTitle={''} /> }
			</div>
		</main>
	);
}
