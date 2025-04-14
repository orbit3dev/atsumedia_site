import React from 'react';
import Link from 'next/link';
import { cn } from '@atsumedia/shared-util';
import { getBasePath } from '../../_lib/config';

type AdTopProps = {
	className?: string;
};

const AdTop: React.FC<AdTopProps> = async ({ className }) => {
	return (
		<div
			className={cn(
				'relative flex h-[120px] w-full items-center justify-center bg-black md:h-[298px]',
				className
			)}>
			<Link href="https://abema.tv/about/premium">
				<picture>
					<img
						className="max-h-[88px] md:max-h-[250px]"
						src={getBasePath('/image/banner/test_bottom_banner_001.png')}
						alt={''}
					/>
				</picture>
			</Link>
		</div>
	);
};

export default AdTop;
