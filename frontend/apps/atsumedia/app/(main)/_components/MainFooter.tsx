import React from 'react';
import MainSearch from './MainSearch';
import CommonFooter from './CommonFooter';

interface Interface {
	searchTitle?: string;
}

const MainFooter = ({ searchTitle }: Interface) => {
	return (
		<>
			<MainSearch title={searchTitle ?? 'カテゴリから探す'} imageUrl={'/image/home/search-icon2.svg'} />
			<CommonFooter />
		</>
	);
};

export default MainFooter;
