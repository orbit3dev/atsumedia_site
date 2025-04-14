import React from 'react';
import { cn } from '@atsumedia/shared-util';

interface MovieH3LineProps {
	text: string;
	className?: string;
}

const H3Line: React.FC<MovieH3LineProps> = ({ text, className }) => {
	return (
		<h3 className={cn('mb-1 flex items-center text-[17px] font-bold', className)}>
			<span className="mr-2 inline-block h-4 w-1 shrink-0 grow-0 basis-1 bg-pink-400 bg-gradient-to-b from-indigo-500 to-purple-500" />
			{text}
		</h3>
	);
};

export default H3Line;
