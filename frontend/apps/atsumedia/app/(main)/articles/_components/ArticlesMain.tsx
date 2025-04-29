import React, { Suspense } from 'react';
import MainTitle from '../../_components/MainTitle';
import ArticlesListPagination from './ArticlesListPagination';
import { getIsTopNewsList, getNewsListByGenreType } from '../../lib';
import { CategoryType } from '@atsumedia/data';

interface ArticlesMainProps {
	isCategory?: boolean;
	type?: CategoryType;
}

async function getNewsData(isCategory: boolean, type: CategoryType, limit: number) {
	if (isCategory) {
		return await getNewsListByGenreType(type, limit);
	} else {
		return await getIsTopNewsList(type,limit);
	}
}

const ArticlesMain: React.FC<ArticlesMainProps> = (props) => {
	return (
		<div className="ml-[10px] md:ml-0">
			<MainTitle title={`ニュース一覧`} imageUrl={'/image/home/net-icon.svg'} />
			<Suspense fallback={<>loading...</>}>
				<ArticlesList {...props} />
			</Suspense>
		</div>
	);
};

const ArticlesList: React.FC<ArticlesMainProps> = async ({ isCategory = false, type }) => {
	const { newsList, nextToken } = await getNewsData(isCategory, type ? type : ('' as CategoryType), 18);
	return <ArticlesListPagination defaultData={newsList} nextToken={nextToken} isCategory={isCategory} type={type} />;
};

export default ArticlesMain;
