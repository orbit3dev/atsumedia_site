import React, { FC, PropsWithChildren } from 'react';

type LayoutWithRightProps = {
	right?: React.ReactNode;
};
const LayoutWithRight: FC<PropsWithChildren<LayoutWithRightProps>> = ({ children, right }) => {
	return (
		<div className="mx-auto max-w-[1600px] box-border flex flex-col pt-4 md:min-w-[1024px] md:flex-row md:px-[80px] md:pt-10">
			<div className="md:ml-[10px] flex-1 md:border-r md:pr-[104px]">{children}</div>
			<div className={'mb-[25px] px-4 md:mb-[64px] md:w-[348px] md:shrink-0 md:grow-0 md:basis-[348px] md:pl-12'}>
				{right}
			</div>
		</div>
	);
};

export default LayoutWithRight;
