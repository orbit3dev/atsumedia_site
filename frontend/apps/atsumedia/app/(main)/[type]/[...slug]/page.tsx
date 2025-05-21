import React from 'react';
import { CategoryType } from '@atsumedia/data';
import { notFound, permanentRedirect } from 'next/navigation';
import { headers } from 'next/headers';
import DetailContent from './_components/DetailContent';
import MainPath from '../../_components/MainPath';
import { Metadata } from 'next';
import StatisticClickCount from './_components/StatisticClickCount';
import { checkParams, getResultData } from './_utils/get-data';

type PageProps = {
	params: { type: CategoryType; slug: string[] };
};

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const check = checkParams(params.type);
	if (!check) {
		return {};
	}
	const { data } = await getResultData(params);
	const headersList = headers();
	const host = headersList.get('host') || 'localhost';
	const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1');
	const protocol = isLocal ? 'http' : 'https';
	const baseUrl = `${protocol}://${host}`;
	const imagePath = '/public/anime/dummy_thumbnail.png';

	return {
		title: data?.titleMeta,
		description: data?.descriptionMeta,
		openGraph: {
			title: data?.titleMeta,
			type: 'website',
			description: data?.descriptionMeta,
			images: [`${baseUrl}${imagePath}`],
			locale: 'ja_JP',
		},
	};
}

const Page = async ({ params }: PageProps) => {
	const check = checkParams(params.type);
	if (!check) {
		return notFound();
	}
	const { paths, targetCategory, data, parentData } = await getResultData(params);
	if (!data) {
		return notFound();
	}

	const showElement = () => {
		if (data.genreType === 'movie') {
			if (data.tagType === 'root') {
				if (data.childs && data.childs.length > 0) {
					return false;
				} else {
					return true;
				}
			} else {
				return true;
			}
		} else {
			return true;
		}
	}

	if (data.genreType === 'movie' && data.tagType === 'root') {
		if (data.childs && data.childs.length === 1) {
			let firstChildPath = data.childs[0]?.pathName;
			const currentPath = data.pathName;
			const pathTrimmer = currentPath + '/';

			if (firstChildPath && firstChildPath.startsWith(pathTrimmer)) {
				const relativeChildPath = firstChildPath.slice(pathTrimmer.length);

				if (relativeChildPath && currentPath !== firstChildPath) {
					return permanentRedirect(firstChildPath);
				}
			}
		}
	}

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: data.titleMeta,
		image: [data.thumbnail?.url],
		datePublished: data.createdAt,
		dateModified: data.updatedAt,
		author: data.authors.map((item) => {
			return {
				'@type': 'Person',
				name: item.person?.name,
				// url: S3Domain + '/' + item.person.image,
			};
		}),
	};
	return (
		<>
			<section>
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }
				} />
			</section>
			< MainPath paths={paths} />
			<DetailContent category={targetCategory} tagType={data.tagType} data={data} parentData={parentData} showElement={showElement()} />
			<StatisticClickCount data={data} />
		</>
	);
};

export default Page;