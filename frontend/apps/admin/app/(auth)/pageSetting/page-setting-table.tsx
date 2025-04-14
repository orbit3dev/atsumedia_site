import { DataTable } from '@atsumedia/shared-ui';
import type { Schema } from '@atsumedia/amplify-backend';
import { usePagination } from '@sevenvip666/react-art';
import { userPoolClient } from '@atsumedia/amplify-client';
import React from 'react';
import { useColumns } from '@admin/(auth)/pageSetting/columns';
import { CategoryType } from '@atsumedia/data';
import { checkId, checkNumberOrEmpty, checkStringNotEmpty } from '@admin/_lib/utils/csv-data-regx';
import CsvUploadProvider from '@admin/(auth)/_components/csv-upload-provider';
import { handleUpload } from '@admin/(auth)/pageSetting/csv-upload/csv-upload-utils';

export type PageSettingType = Schema['PageSetting']['type'];
const selectionSet = ['articleId', 'type', 'sort'] as const;
export type PageSettingWithComments = PageSettingType;

type TagTableProps = {
	genreType: CategoryType;
};

export function PageSettingTable({ genreType }: TagTableProps) {
	const carouselStore = usePagination<PageSettingWithComments[], { content: string; limit: number }>(
		({ limit, nextToken, content }) => {
			const params = {
				limit: limit,
				nextToken: nextToken,
				selectionSet: selectionSet,
				sort: content ? { eq: parseInt(content) } : undefined,
			};
			// @ts-ignore
			return userPoolClient.models.PageSetting.settingListByTypeAndSort({
				type: genreType + '-CAROUSEL',
				...params,
			});
		},
		{
			getNextToken: (res) => res.nextToken,
		}
	);
	const spotlightStore = usePagination<PageSettingWithComments[], { content: string; limit: number }>(
		({ limit, nextToken, content }) => {
			const params = {
				limit: limit,
				nextToken: nextToken,
				selectionSet: selectionSet,
				sort: { eq: parseInt(content) },
			};
			// @ts-ignore
			return userPoolClient.models.PageSetting.settingListByTypeAndSort({
				type: genreType + '-SPOTLIGHT',
				...params,
			});
		},
		{
			getNextToken: (res) => res.nextToken,
		}
	);
	const carouselColumns = useColumns({ store: carouselStore });
	const spotlightColumns = useColumns({ store: spotlightStore });
	return (
		<>
			<div className={'flex items-center justify-end'}>
				<CsvUploadProvider
					successCallback={() => {
						carouselStore.refresh().then();
						spotlightStore.refresh().then();
					}}
					genreType={'anime'}
					handleUpload={handleUpload}
					objectMappers={[
						{ name: 'articleId', index: 0, check: checkId },
						{ name: 'genreType', index: 1, check: checkStringNotEmpty },
						{ name: 'type', index: 2, check: checkStringNotEmpty },
						{ name: 'sort', index: 3, check: checkNumberOrEmpty },
					]}
					skipRows={3}
					skipColumns={1}
				/>
			</div>
			<h2 className={'px-3 py-2 font-bold'}>CAROUSEL</h2>
			<DataTable columns={carouselColumns} store={carouselStore} />
			<h2 className={'px-3 py-2 font-bold'}>SPOTLIGHT</h2>
			<DataTable columns={spotlightColumns} store={spotlightStore} />
		</>
	);
}
