import React from 'react';
import ArticlesMainInfo from './ArticlesMainInfo';
import { News } from '@atsumedia/data';

interface ArticlesDetailMainProps {
	data: News;
}

const ArticlesDetailMain: React.FC<ArticlesDetailMainProps> = ({ data }) => {
	return (
		<div className="flex-1">
			<ArticlesMainInfo data={data} />
		</div>
	);
};

export default ArticlesDetailMain;
