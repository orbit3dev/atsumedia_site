import React from 'react';
import Link from 'next/link';
import { getBasePath } from '../../_lib/config';

interface MCategoryRightProps {
	adList: { imgUrl: string; href: string }[];
}

const CategoryRight: React.FC<MCategoryRightProps> = ({ adList }) => {
	return (
		<>
			<div className="grid grid-cols-2 items-center gap-2 md:grid-cols-1 md:gap-y-10">
				{adList.map((item, index) => (
					<Link key={item.href + index} href={item.href}>
						<picture className="w-full overflow-hidden rounded-md md:w-[300px]">
							<img className="m-auto" src={getBasePath(item.imgUrl)} alt={''} />
						</picture>
					</Link>
				))}
			</div>
		</>
	);
};

export default CategoryRight;
