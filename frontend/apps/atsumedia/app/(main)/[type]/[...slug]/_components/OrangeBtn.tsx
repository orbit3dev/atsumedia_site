import React from 'react';
import { Button } from '@atsumedia/shared-ui';
import Link from 'next/link';

type Props = {
	microcopy?: string;
	text: string;
	url: string;
	title?: string;
};

const OrangeBtn: React.FC<Props> = ({ text, url, microcopy,title }) => {
	return (
		<>
			<Link href={url} target="_blank" className={'group text-[#FF6534] hover:text-[#f53a50]'}>
				{microcopy && (
					<div className="flex items-center justify-center text-center font-bold md:text-base">
						<span className="mx-3 inline-block h-[15px] w-[1px] -rotate-[30deg] bg-[#FF6534] align-top font-normal group-hover:bg-[#f53a50]" />
						{/* {(title ? title + ' ' : '') + microcopy + 'で視聴'} */}
						{(title ? title + ' ' : '') + microcopy }
						<span className="mx-3 inline-block h-[15px] w-[1px] rotate-[30deg] bg-[#FF6534] group-hover:bg-[#f53a50]" />
					</div>
				)}
				{/* eslint-disable-next-line react/jsx-no-undef */}
				<Button
					variant={'orange'}
					className="mx-auto mb-6 mt-2 block h-auto px-14 py-6 text-[17px] font-bold group-hover:bg-[#f53a50] md:text-[21px]">
					{text}
				</Button>
			</Link>
		</>
	);
};

export default OrangeBtn;
