import React from 'react';
import { cn } from '@atsumedia/shared-util';

interface MovieGrayTagProps {
	text: string;
	className?: string;
}

const GrayTag: React.FC<MovieGrayTagProps> = ({ text, className }) => {
	return (
		<span
			className={cn(
				'inline-block my-0.5 h-[26px] !leading-[26px] rounded-sm bg-[#F0F0F0] px-2 md:px-3 text-[#2F8FEA]',
				className
			)}>
			{text}
		</span>
	);
};

export default GrayTag;
