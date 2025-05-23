'use client';

import React, { useEffect } from 'react';
import { Article } from '@atsumedia/data';
import { getBasePath } from '../../../../_lib/config';

type Props = {
	data: Article;
};

const StatisticClickCount: React.FC<Props> = ({ data }) => {
	useEffect(() => {
		fetch(getBasePath('/api/article-statistic'), {
			method: 'post',
			body: JSON.stringify({
				articleId: data.id,
				genreType: data.genreType,
				tagType: data.tagType,
				parentArticleId: data.parentId,
			}),
		})
			.then()
			.catch((err) => {
				console.log(err);
			});
	}, [data]);
	return null;
};

export default StatisticClickCount;
