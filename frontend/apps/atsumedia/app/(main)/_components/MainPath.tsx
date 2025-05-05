import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export type MainPathProps = {
	paths?: { name: string; path?: string }[];
};

const MainPath: React.FC<MainPathProps> = ({ paths }) => {
	const domain = process.env.DOMAIN;

    // From breadcrumbs this will result in TOP -> (Category, e.g. "Movie") -> Parent -> Child
    // If parent and child is the same filter out the parent
    const filteredPaths = paths?.filter((item, index) => {
        if (index === 0) return true; // Always include the first item (Category)
        if (index > 0 && item.name === paths[index + 1]?.name) return false; // Filter out the parent if the current item has the same name
        return true; // Include all other items
    });

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [{ name: 'TOP', path: '/' }, ...(filteredPaths ?? [])]?.map((item, index) => {
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
							{filteredPaths?.map((item, index) => (
							<span className={'inline-flex items-center whitespace-nowrap'} key={item.name}>
								{item.path && <Link href={item.path}>{item.name}</Link>}
								{!item.path && item.name}
								{index != filteredPaths.length - 1 && (
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
