import React from 'react';
import { cn } from '@atsumedia/shared-util';

interface MovieMainTitleProps {
	title: string;
	className?: string;
	children: React.ReactNode;
}

const MainTitle: React.FC<MovieMainTitleProps> = ({ title, className, children }) => {
	return (
		<div>
			<h2 className="my-6 flex items-center bg-black px-4 py-3 font-bold text-white md:py-4 md:rounded-lg md:text-[21px]">
				{title}
			</h2>
			<div className={cn('px-[16px]', className)}>{children}</div>
		</div>
	);
};

export default MainTitle;
