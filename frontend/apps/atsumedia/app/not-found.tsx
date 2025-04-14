import MainHeader from './(main)/_components/MainHeader';
import MainFooter from './(main)/_components/MainFooter';
import React from 'react';
import { getBasePath } from './_lib/config';

/**
 * 404
 * @constructor
 */
export default async function ErrorPage() {
	return (
		<main className="flex h-[100vh] flex-col">
			<MainHeader />
			<div className="flex flex-1 flex-col scroll-auto">
				<div className="flex flex-1 flex-col items-center justify-center">
					<picture className="mb-10 mt-10 w-2/4 md:mb-[72px] md:w-auto">
						<img src={getBasePath('/image/common/404.png')} alt={'404'} />
					</picture>
					<p className="px-4 text-sm font-bold md:text-[17px]">お探しのページは見つかりませんでした。</p>
					<p className="mb-[64px] px-4 text-sm font-bold md:text-[17px]">
						このサイトには、下記のようなコンテンツが用意されているので、ご覧ください 。
					</p>
				</div>
				<MainFooter searchTitle={''} />
			</div>
		</main>
	);
}
