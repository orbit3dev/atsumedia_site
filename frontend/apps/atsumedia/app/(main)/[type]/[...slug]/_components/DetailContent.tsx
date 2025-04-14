import React, { Suspense } from 'react';
import DetailMain from './DetailMain';
// import DetailRightProvider from './DetailRightProvider';
import DetailPopular from './DetailPopular';
import { Article, KeyValue, TagType } from '@atsumedia/data';
import LayoutWithRight from '../../../_components/LayoutWithRight';
import AdFooter from '../../../_components/AdFooter';
import AdTop from '../../../_components/AdTop';
import { getPhotographyOrPopularityDataListBy3, getPhotographyOrPopularityDataListBy8 } from '../_utils/get-data';

type Props = {
	tagType: TagType;
	data: Article;
	category: KeyValue;
    parentData: Article | null | undefined;
};

const DetailContent: React.FC<Props> = async ({ tagType, data, category, parentData }) => {
	const [photographyList, popularityList] = await Promise.all([
		getPhotographyOrPopularityDataListBy8(data),
		getPhotographyOrPopularityDataListBy3(data),
	]);
	return (
		<>
			{/*<AdTop />*/}
			{/*<LayoutWithRight right={*/}
			{/*		<Suspense fallback={<div>Loading...</div>}>*/}
			{/*			<DetailRightProvider article={data} />*/}
			{/*		</Suspense>*/}
			{/*	}>*/}
			<LayoutWithRight>
				<DetailMain
					data={data}
					tagType={tagType}
					photographyList={photographyList}
					popularityList={popularityList}
                    parentData={parentData}
				/>
			</LayoutWithRight>
			<Suspense fallback={<div>Loading...</div>}>
				<DetailPopular category={category} />
			</Suspense>
			{/*<AdFooter />*/}
		</>
	);
};

export default DetailContent;
