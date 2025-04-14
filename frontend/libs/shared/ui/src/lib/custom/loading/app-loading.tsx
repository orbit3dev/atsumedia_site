'use client';
import React, { CSSProperties } from 'react';
import MoonLoader from 'react-spinners/MoonLoader';

const override: CSSProperties = {
	display: 'block',
	margin: '0 auto',
};

interface AppLoadingProps {
	size?: 'default' | 'small';
}

export const AppLoading: React.FC<AppLoadingProps> = ({ size }: AppLoadingProps) => {
	let loadSize;
	switch (size) {
		case 'default':
			loadSize = 35;
			break;
		case 'small':
			loadSize = 28;
			break;
		default:
			loadSize = 35;
			break;
	}
	return (
		<div className="flex min-h-full w-full items-center">
			<MoonLoader size={loadSize} loading={true} cssOverride={override} />
		</div>
	);
};
