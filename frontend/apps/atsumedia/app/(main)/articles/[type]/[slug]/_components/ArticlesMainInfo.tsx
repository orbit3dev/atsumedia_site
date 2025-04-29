'use client';
import React from 'react';
import GrayTag from '../../../../[type]/[...slug]/_components/GrayTag';
import { getCategoryByType, News } from '@atsumedia/data';
import { format } from 'date-fns';
import MyImage from '../../../../_components/MyImage';
import Banner from '../../../../_components/Banner';
import dynamic from 'next/dynamic';
import { OutputBlockData, OutputData } from '@editorjs/editorjs/types/data-formats/output-data';
import ArticlesContent from './ArticlesContent';
import styles from './ArticlesMainInfo.module.css';
import { renderToStaticMarkup } from 'react-dom/server';
import parse from 'html-react-parser';
import { isExternalDomainExtended } from '../../../../../_lib/config';

interface ArticlesMainInfoProps {
	data: News;
}

const dateFormat = (dateStr: string) => {
	return format(new Date(dateStr), 'yyyy年MM月dd日');
};

const getCatalogue = (content: string) => {
	try {
		const editData = JSON.parse(content) as OutputData;
		const headerBlocks: OutputBlockData<string, { level: number; text: string }>[] = editData.blocks.filter(
			(item) => item.type == 'header'
		);
		return headerBlocks;
	} catch (e) {
		console.error(e);
		return [];
	}
};

const Editor = dynamic(() => import('@atsumedia/shared-editor').then((module) => module.SharedEditor), { ssr: false });

// Function to process <a> tags and add target="_blank"
const processLinks = (htmlContent: string): string => {
	try {
		// Parse the JSON content
		const contentData = JSON.parse(htmlContent);

		// Iterate through the blocks and modify <a> tags in the "text" field
		contentData.blocks = contentData.blocks.map((block: any) => {
			if (block.data?.text) {
				// Use html-react-parser to modify <a> tags
				const modifiedText = parse(block.data.text, {
					replace: (domNode) => {
						if (domNode.type === 'tag' && domNode.name === 'a') {
							const href = domNode.attribs.href;
							// Check if the link is external
							if (isExternalDomainExtended(href)) {
								// Add target="_blank" to external links
								const element = domNode as any;
								element.attribs.target = '_blank'; // Add target="_blank" to <a> tags
								element.attribs.rel = 'noopener noreferrer'; // Add rel="noopener noreferrer" for security
							}
						}
					},
				});

				// Convert the modified React elements back to a string
				block.data.text = renderToStaticMarkup(<>{modifiedText}</>);
			}
			return block;
		});

		// Return the modified content as a JSON string
		return JSON.stringify(contentData);
	} catch (e) {
		console.error('Error processing links:', e);
		return htmlContent; // Return the original content if an error occurs
	}
};

const ArticlesMainInfo: React.FC<ArticlesMainInfoProps> = ({ data }) => {
	const headerBlockList = getCatalogue(data.content);
	const category = getCategoryByType(data.genreType);

	const editedData = processLinks(data.content);

	return (
		<div className="pb-1">
			<div className="px-4 md:px-3">
				<p
					className={`inline-block h-[18px] rounded-full px-2 text-[10px] leading-[18px] text-white`}
					style={{ backgroundColor: category.color ?? '' }}>
					{category.name}
				</p>
				<h1 className="mb-2 text-[21px] font-bold md:text-[29px]">{data.title}</h1>
				<div className="mb-2 flex flex-col justify-between text-[13px] xl:flex-row xl:space-x-5">
					<div className="flex flex-row">
						<p>公開日：{dateFormat(data.datetime)}</p>
						<p className="ml-4">更新日：{dateFormat(data.updatedAt)}</p>
					</div>
					<div>
						<GrayTag
							text="本サイトはアフィリエイト広告を利用しています"
							className="text-[10px] text-gray-500"
						/>
					</div>
				</div>
				{/*<div className="mb-2 space-x-2 text-[13px]">*/}
				{/*	<GrayTag text={'タグ'} />*/}
				{/*	<GrayTag text={'タグ'} />*/}
				{/*	<GrayTag text={'タグ'} />*/}
				{/*	<GrayTag text={'タグ'} />*/}
				{/*</div>*/}
				<div className="my-5 md:my-14">
					<MyImage // path={'public/anime/dummy_thumbnail.png'}
						path={data.image ? data.image : 'public/anime/dummy_thumbnail2.png'}
						alt={data.title}
						isMainImage={true}
					/>
					<div className={'mt-5 text-[15px]'} dangerouslySetInnerHTML={{ __html: data.outline }} />
					{data.author?.banner && (
						<div>{data.author.banner && <Banner bannerHtml={data.author.banner} />}</div>
					)}
				</div>
			</div>
			{headerBlockList.length > 0 && <ArticlesContent data={headerBlockList} />}
			<div className={'editor mt-5 !p-0 text-[15px] md:!px-3 ' + styles.linkColor}>
				<Editor readOnly={true} defaultValue={editedData} />
			</div>
			<div className="my-5 px-4 md:my-14 md:px-3">
				<div className={'rounded-md border p-5 md:p-8'}>
					<div className={'flex items-center md:items-start'}>
						<MyImage // path={item.image ? item.image : 'public/cast/dummy_cast_image.png'}
							path={'public/cast/author.png'}
							alt={''}
							className="relative h-[88px] w-[88px] shrink-0 grow-0 basis-[88px] overflow-hidden rounded-full object-cover p-0"
						/>
						<div className={'max-w-full flex-1 pl-4'}>
							<p className={'text-[13px]'}>著者</p>
							<h3 className={'text-[17px] font-bold'}>
								{data.author ? data.author.name : 'あつめでぃあ編集部'}
							</h3>
							<p className={'mt-2 line-clamp-3 hidden text-[15px] md:block'}>
								{data.author ? data.author.description : 'ダミーテキスト'}
							</p>
						</div>
					</div>
					<p className={'mt-5 block text-[15px] md:hidden'}>
						{data.author ? data.author.description : 'ダミーテキスト'}
					</p>
				</div>
			</div>
		</div>
	);
};

export default ArticlesMainInfo;
