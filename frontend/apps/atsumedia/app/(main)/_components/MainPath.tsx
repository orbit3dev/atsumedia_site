import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export type MainPathProps = {
	paths?: { name: string; path?: string }[];
};

const MainPath: React.FC<MainPathProps> = ({ paths }) => {
	const domain = process.env.DOMAIN;
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [{ name: 'TOP', path: '/' }, ...(paths ?? [])]?.map((item, index) => {
			return {
				'@type': 'ListItem',
				position: index + 1,
				name: item.name,
				item: item.path ? `${domain ?? ''}${item.path}` : undefined,
			};
		}),
	};
	return (
		<>
			<section>
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			</section>
			<div className="h-[34px] w-full overflow-hidden bg-[#f0f0f0]">
				<div className="h-[60px] w-full overflow-x-scroll">
					<p className="flex w-full items-center px-2.5 text-[13px] leading-[34px] md:px-[57px]">
						<Link href="/">TOP</Link>
						<span className="mx-1">
							<ChevronRight size={16} />
						</span>
						{paths?.map((item, index) => (
							<span className={'inline-flex items-center whitespace-nowrap'} key={item.name}>
								{item.path && <Link href={item.path}>{item.name}</Link>}
								{!item.path && item.name}
								{index != paths.length - 1 && (
									<span className="mx-1 block">
										<ChevronRight size={16} />
									</span>
								)}
							</span>
						))}
					</p>
				</div>
			</div>
		</>
	);
};

export default MainPath;
