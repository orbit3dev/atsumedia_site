import React from 'react';
import { cn } from '@atsumedia/shared-util';

interface MovieH3ArrowProps {
	text: string;
	className?: string;
}

const H3Arrow: React.FC<MovieH3ArrowProps> = ({ text, className }) => {
	return (
		<h3 className={cn('flex flex-row items-center font-bold md:mb-3 md:px-2 md:text-[17px]', className)}>
			<picture className="mr-1 w-3 md:w-3">
				<img src={'/image/common/arrow.png'} alt={''} title={''}/>
			</picture>
			{text}
		</h3>
	);
};

export default H3Arrow;
