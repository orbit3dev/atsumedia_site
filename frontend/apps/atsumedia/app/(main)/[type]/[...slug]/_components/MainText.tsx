import React from 'react';

interface MovieMainTextProps {
	text: string;
	truncateText: boolean;
}

const MainText: React.FC<MovieMainTextProps> = ({ text, truncateText }) => {
	return (
		<h2 className={`${truncateText ? 'truncate-text' : ''} mb-6 px-1 text-justify text-[15px] font-[300]`}>
			{text}
		</h2>
	);
};

export default MainText;
