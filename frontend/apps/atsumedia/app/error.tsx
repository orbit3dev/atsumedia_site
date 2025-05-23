'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import * as React from 'react';
import MainHeader from './(main)/_components/MainHeader';
import MainFooter from './(main)/_components/MainFooter';
import { getBasePath } from './_lib/config';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<main className="flex h-[100vh] flex-col">
			<MainHeader />
			<div className="flex flex-1 flex-col scroll-auto">
				<div className="flex flex-1 flex-col items-center justify-center">
					<picture className="mb-10 mt-10 w-2/4 md:mb-[72px] md:w-auto">
						<img src={getBasePath('/image/common/error_reset.png')} alt={'error'} />
					</picture>
					<span className="my-3">エラーが発生しました:</span>
					<p>{error.message}</p>
					<p className={'w-full whitespace-pre-wrap'}>{error.stack?.substring(0, 1000)}...</p>
				</div>
				<MainFooter searchTitle={''} />
			</div>
		</main>
	);
}
