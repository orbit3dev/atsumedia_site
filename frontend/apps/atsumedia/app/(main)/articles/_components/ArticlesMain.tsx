import React, { Suspense } from 'react';
import MainTitle from '../../_components/MainTitle';
// import ArticlesListPagination from './ArticlesListPagination';
import ArticlesListPaginationNew from './ArticlesListPaginationNew';
import { getIsTopNewsList, getNewsListByGenreType } from '../../lib';
import { CategoryType } from '@atsumedia/data';
import QueryProvider from './QueryProvider';

interface ArticlesMainProps {
	isCategory?: boolean;
	genreType?: string;
	searchParams?: {
    page?: string;
  };
	type?: CategoryType;
}

async function getNewsData(isCategory: boolean, genreType: string, limit: number) {
	if (isCategory) {
		return await getNewsListByGenreType(genreType, limit);
	} else {
		return await getIsTopNewsList(genreType,limit);
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

const ArticlesList: React.FC<ArticlesMainProps> = async ({ 
  isCategory = false, 
  genreType,
  searchParams,
  type 
}) => {
	const effectiveGenreType = type || genreType || '';
  const page = parseInt(searchParams?.page || '1', 10);
  const { newsList, totalPages } = await getNewsData(
    isCategory, 
   effectiveGenreType,
    18,
    // page
  );
  const selectGenreType = type || genreType;
  return (
    <QueryProvider>
      <ArticlesListPaginationNew 
        defaultData={newsList} 
        totalPages={totalPages}
        isCategory={isCategory} 
        type={selectGenreType}
      />
    </QueryProvider>
  );
};

// const ArticlesList: React.FC<ArticlesMainProps> = async ({ isCategory = false, type }) => {
// 	const { newsList, nextToken } = await getNewsData(isCategory, type ? type : ('' as CategoryType), 18);
// 	// return <ArticlesListPagination defaultData={newsList} nextToken={nextToken} isCategory={isCategory} type={type} />;
// 	return (
//     <QueryProviderWrapper>
//       <ArticlesListPaginationNew defaultData={newsList} nextToken={nextToken} isCategory={isCategory} type={type} />
//     </QueryProviderWrapper>
//   );
// //   return <ArticlesListWithQuery defaultData={newsList} nextToken={nextToken} isCategory={isCategory} type={type} />;
// };

// const ArticlesList: React.FC<ArticlesMainProps> = async ({ isCategory = false, type }) => {
//   const { newsList, nextToken } = await getNewsData(isCategory, type, 18);
//   return <ArticlesListWithQuery defaultData={newsList} nextToken={nextToken} isCategory={isCategory} type={type} />;
// };

export default ArticlesMain;
