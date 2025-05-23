'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { genreList } from '@atsumedia/data';
import { getBasePath } from '../../_lib/config';

const h1Paths = [
	'/',
	...genreList.map((item) => [`/${item}`, `/${item}/list`]).flat(),
	'/articles',
	...genreList.map((item) => [`/articles/${item}`]).flat(),
];
const MainHeader = () => {
	const path = usePathname();
	const isH1 = h1Paths.includes(path);
	const className = 'relative h-[40px] w-[168px]';
	return (
		<div className={'flex h-[40px] w-full items-center justify-between px-2.5 md:px-[57px]'}>
			{isH1 ? (
				<h1 className={className}>
					<LogoImg />
				</h1>
			) : (
				<div className={className}>
					<LogoImg />
				</div>
			)}
		</div>
	);
};

const LogoImg = () => {
	return (
		<Link href="/">
			<Image
				fill
				src={getBasePath('/image/common/atsumedia_logo.png')}
				alt="あつめでぃあ | アニメ配信情報/番組情報/メディア情報サイト"
				title="あつめでぃあ | アニメ配信情報/番組情報/メディア情報サイト"
			/>
		</Link>
	);
};

export default MainHeader;
