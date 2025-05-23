'use client';
import React, { useState } from 'react';
import MainTitle from '../../_components/MainTitle';
import CategoryListItem from './CategoryListItem';
import { Button } from '@atsumedia/shared-ui';
import { ChevronRight } from 'lucide-react';
import { Article } from '@atsumedia/data';

interface MovieMainProps {
	categoryName: string;
	data?: Article[];
}

function limitData(limitFlag: boolean, data?: Article[]) {
	if (!data) {
		return [];
	}
	if (limitFlag) {
		return data.slice(0, 9);
	}
	return data;
}

const CategoryMain: React.FC<MovieMainProps> = ({ categoryName, data }) => {
	const [limitFlag, setLimitFlag] = useState(true);
	return (
		<div className={'ml-[10px] md:ml-0'}>
			<MainTitle title={`最新の${categoryName}一覧`} imageUrl={'/image/home/star-icon.svg'} />
			<div className="grid w-full grid-cols-2 gap-y-4 text-xs lg:grid-cols-3">
				{limitData(limitFlag, data).map((item, index) => (
					<CategoryListItem key={item.id} data={item} visibleByDefault={index < 9} />
				))}
			</div>
			<div className="my-10 flex justify-center md:mb-0 md:justify-end">
				{limitFlag ? (
					<Button variant={'gray'} className="rounded-full text-[15px]" onClick={() => setLimitFlag(false)}>
						最新の{categoryName}をもっと見る <ChevronRight size={16} />
					</Button>
				) : (
					<Button variant={'gray'} className="rounded-full md:text-[15px]" onClick={() => setLimitFlag(true)}>
						閉じる -{/*todo*/}
					</Button>
				)}
			</div>
		</div>
	);
};

export default CategoryMain;
