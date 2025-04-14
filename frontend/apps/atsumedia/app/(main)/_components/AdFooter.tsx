import React from 'react';
import Link from 'next/link';
import { getBasePath } from '../../_lib/config';

type AdFooterProps = {};

const AdFooter: React.FC<AdFooterProps> = async () => {
	return (
		<>
			<div className="relative flex w-full items-center justify-center px-4">
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
			<div className="my-10 grid grid-cols-2 items-center gap-2.5 px-4 md:gap-10">
				<Link className="flex justify-end" href="https://abema.tv/about/premium">
					<picture className="w-full overflow-hidden md:w-[300px]">
						<img src={getBasePath('/image/banner/test_bottom_banner_002.png')} alt={''} />
					</picture>
				</Link>
				<Link href="https://www.hulu.jp/">
					<picture className="w-full overflow-hidden md:w-[300px]">
						<img src={getBasePath('/image/banner/test_bottom_banner_003.png')} alt={''} />
					</picture>
				</Link>
			</div>
		</>
	);
};

export default AdFooter;
