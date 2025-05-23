import { OutputBlockData } from '@editorjs/editorjs/types/data-formats/output-data';
import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

interface ArticlesContentProps {
	data: OutputBlockData<string, { level: number; text: string }>[];
}

const ArticlesContent: React.FC<ArticlesContentProps> = ({ data }) => {
	const [showCatalogue, setShowCatalogue] = useState(false);
	const getCatalogueElement = (item: OutputBlockData<string, { level: number; text: string }>, index: number) => {
		const {
			id,
			data: { level, text },
		} = item;
		if (level == 2) {
			return (
				<h2 key={index} className={'text-[17px] font-bold'}>
					<a href={`#${id ?? id}`}>{text}</a>
				</h2>
			);
		} else if (level == 3) {
			return (
				<h3 key={index} className={'pl-6'}>
					<a href={`#${id ?? id}`}>{text}</a>
				</h3>
			);
		} else if (level == 4) {
			return (
				<h4 key={index} className={'pl-12'}>
					<a href={`#${id ?? id}`}>{text}</a>
				</h4>
			);
		}
		return <></>;
	};

	return (
		<div className="md:px-3">
			<div className={'relative overflow-hidden md:rounded-md md:border'}>
				<div className={'flex items-center justify-between bg-[#F0F0F0] px-4 py-3'}>
					<p className={'md:text-[21px]'}>目次</p>
					<p className={'text-[#737373] md:text-[21px]'}>
						{showCatalogue ? (
							<Minus onClick={() => setShowCatalogue(false)} />
						) : (
							<Plus onClick={() => setShowCatalogue(true)} />
						)}
					</p>
				</div>
				<div
					className={`${showCatalogue ? 'max-h-[2000px]' : 'max-h-[130px]'} space-y-2  overflow-y-auto p-5 text-[15px] text-[#2f8fea] transition-all`}>
					{data.map((item, index) => getCatalogueElement(item, index))}
				</div>
				{!showCatalogue && (
					<div
						className={
							'absolute bottom-0 left-0 h-4 w-full bg-gradient-to-b from-transparent to-white'
						}></div>
				)}
			</div>
		</div>
	);
};

export default ArticlesContent;
