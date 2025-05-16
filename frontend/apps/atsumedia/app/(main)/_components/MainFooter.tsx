import React from 'react';
import MainSearch from './MainSearch';
import CommonFooter from './CommonFooter';

interface Interface {
	searchTitle?: string;
}
const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

const MainFooter = ({ searchTitle }: Interface) => {
	return (
		<>
			{!MAINTENANCE_MODE && (
				<MainSearch
					title={searchTitle ?? 'カテゴリから探す'}
					imageUrl={'/image/home/search-icon2.svg'}
				/>
			)}
			<CommonFooter />
		</>
	);
};

export default MainFooter;
