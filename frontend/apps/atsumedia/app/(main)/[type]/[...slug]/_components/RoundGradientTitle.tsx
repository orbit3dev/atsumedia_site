import React from 'react';

type MovieRoundGradientTitleProps = {
	text: string;
};

const RoundGradientTitle: React.FC<MovieRoundGradientTitleProps> = ({ text }) => {
	return (
		<div>
			<span className="inline-block h-2 w-2 shrink-0 grow-0 basis-2 rounded-full bg-gradient-to-b from-[#226DFF] to-[#D458FF]" />
			<span className="ml-2 text-[15px] font-[500]">{text}</span>
		</div>
	);
};

export default RoundGradientTitle;
