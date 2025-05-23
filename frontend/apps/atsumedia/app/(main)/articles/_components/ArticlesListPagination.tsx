// 'use client';

// import React, { useEffect } from 'react';
// import { CategoryType, News } from '@atsumedia/data';
// import { usePagination } from '@sevenvip666/react-art';
// import { NewsListSelectionSet } from '../../type';
// import { iamClient } from '@atsumedia/amplify-client';
// import { AppDataTablePagination } from '@atsumedia/shared-ui/ui/lib/custom/app-data-table-pagination';
// import ListItem from '../../_components/ListItem';

// interface ArticlesListPaginationProps {
// 	defaultData: News[];
// 	nextToken?: string | null;
// 	isCategory?: boolean;
// 	type?: CategoryType;
// }

// const ArticlesListPagination: React.FC<ArticlesListPaginationProps> = ({
// 	defaultData,
// 	nextToken,
// 	isCategory,
// 	type,
// }) => {
// 	useEffect(() => {
// 		if (window.location.href.indexOf('page=') == -1) {
// 			window.history.replaceState({ page: 1 }, '', '?page=' + 1);
// 		}
// 	}, []);
// 	const store = usePagination<News[], { limit: number }>(
// 		({ limit, nextToken }) => {
// 			const params = {
// 				selectionSet: NewsListSelectionSet,
// 				limit,
// 				nextToken,
// 				genreTypePublic: isCategory ? `${type ? type : ('' as CategoryType)}-1` : undefined,
// 				topPublic: !isCategory ? '1-1' : undefined,
// 				sortDirection: 'DESC',
//                 datetime: { lt: new Date().toISOString() }, // TDOO 本来はサーバー側の現在時刻を使うべき
// 			};
// 			if (isCategory) {
// 				// @ts-ignore
// 				return iamClient.models.News.listByGenreTypePublic(params);
// 			} else {
// 				// @ts-ignore
// 				return iamClient.models.News.listByTopAndTopPublic(params);
// 			}
// 		},
// 		{
// 			manual: true,
// 			pageSize: 18,
// 			initialData: defaultData,
// 			defaultNextToken: nextToken ? nextToken : undefined,
// 			defaultHasNextPage: !!nextToken,
// 			getNextToken: (res) => res.nextToken,
// 		}
// 	);

// 	const { data } = store;

// 	return (
// 		<div className={'pr-[10px] md:pr-0'}>
// 			<div className="grid grid-cols-2 items-start gap-4 text-xs lg:grid-cols-3">
// 				{data
// 					?.map((item) => {
// 						return {
// 							titleMeta: item.title,
// 							genreType: item.genreType,
// 							pathName: item.pathName,
// 							thumbnail: { url: item.image },
// 						};
// 					})
// 					.map((item, index) => (
// 						<ListItem key={index} count={index + 1} data={item} pathNamePrefix={'/articles'} />
// 					))}
// 			</div>
// 			{nextToken ? <AppDataTablePagination store={store} /> : <div className="py-5"></div>}
// 		</div>
// 	);
// };

// export default ArticlesListPagination;
