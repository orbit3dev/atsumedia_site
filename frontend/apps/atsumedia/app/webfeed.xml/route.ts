import RSS from 'rss';
import { getBasePath, rootHost, isExternalDomain, isAdvertisement } from '../_lib/config';
import { getRssNewsList, getPathFromNewsData, getNewsByPathName } from './_lib/fetchData';
import sanitizeHtml from 'sanitize-html';



type NewsItem = {
	id: number;
	title: string;
	genreType: string;
	titleMeta: string;
	descriptionMeta: string;
	image: string;
	pathName: string;
	author: string;
	type: string; // Added missing property
	datetime: string; // Added missing property
	isTop: boolean; // Added missing property
	outline: string; // Added missing property
  };

type NewsDetail = {
	id: string;
	title: string;
	image: string | null | undefined;
	content: string;
	author:Author;
	outline:string;
	datetime:string;
	// other properties...
};

type Author ={
	name: string;
}

type News = {
	id: number;
	title: string;
	genreType: string;
	titleMeta: string;
	descriptionMeta: string;
	image: string;
	pathName: string;
	author: string;
	type: string; // Example of missing property
	datetime: string; // Example of missing property
	isTop: boolean; // Example of missing property
	outline: string; // Example of missing property
	// Other properties...
  };

  const transformToNews = (newsItem: NewsItem): News => {
	return {
	  ...newsItem,
	  type: 'default', // Default value for type
	  datetime: new Date().toISOString(), // Example datetime
	  isTop: false, // Default value for isTop
	  outline: '', // Default value for outline
	};
  };

export async function GET() {
	const newsList: NewsItem[] = await getRssNewsList(15); // Limit 15 for now, can be changed later.

	// URL Using rootHost to dynamically change URL based on branch / environment.
	const feed = new RSS({
		title: 'あつめでぃあ',
		feed_url: rootHost() + getBasePath('/webfeed.xml'),
		site_url: rootHost() + getBasePath('/'),
		description: '静岡新聞SBSのエンタメ総合ポータルサイト',
		pubDate: new Date(),
		language: 'ja',
		copyright: '\u00A9 The Shizuoka Shimbun and Shizuoka Broadcasting System.',
		ttl: 1,
		custom_namespaces: {
			snf: 'http://www.smartnews.be/snf',
			content: 'http://purl.org/rss/1.0/modules/content/',
			dc: 'http://purl.org/dc/elements/1.1/',
			media: 'http://search.yahoo.com/mrss/',
		},
		custom_elements: [
			{
				'snf:logo': [
					{
						url: rootHost() + getBasePath('/image/common/atsumedia_rss_logo.png'),
					},
				],
			},
		],
	});

	for (const news of newsList) {
		const newsDetail = (await getNewsByPathName(news.pathName))[0];
		const newsImage =
		(newsDetail as NewsDetail)?.image !== null ||  (newsDetail as NewsDetail)?.image !== undefined
				? '/' +  (newsDetail as NewsDetail)?.image
				: rootHost() + getBasePath('/public/anime/dummy_thumbnail2.png');

		let newsContent = '';
		try {
			const newsBlock = JSON.parse( (newsDetail as NewsDetail).content);
			//@ts-ignore
			for (const block of newsBlock.blocks) {
				switch (block.type) {
					case 'paragraph':
						if (!isAdvertisement(block.data.text)) {
							let sanitizedText = sanitizeHtml(block.data.text, {
								allowedTags: [
									'address',
									'article',
									'aside',
									'footer',
									'header',
									'h1',
									'h2',
									'h3',
									'h4',
									'h5',
									'h6',
									'hgroup',
									'main',
									'nav',
									'section',
									'blockquote',
									'dd',
									'div',
									'dl',
									'dt',
									'figcaption',
									'figure',
									'hr',
									'li',
									'main',
									'ol',
									'p',
									'pre',
									'ul',
									'abbr',
									'b',
									'bdi',
									'bdo',
									'br',
									'cite',
									'code',
									'data',
									'dfn',
									'em',
									'i',
									'kbd',
									'mark',
									'q',
									'rb',
									'rp',
									'rt',
									'rtc',
									'ruby',
									's',
									'samp',
									'small',
									'span',
									'strong',
									'sub',
									'sup',
									'time',
									'u',
									'var',
									'wbr',
									'caption',
									'col',
									'colgroup',
									'table',
									'tbody',
									'td',
									'tfoot',
									'th',
									'thead',
									'tr',
								],
							});
							newsContent +=
								`<p class="text-` + block.data.alignment + ` text-black">${sanitizedText}</p>`;
						}

						break;
					case 'header':
						newsContent +=
							`<h` +
							block.data.level +
							` class="text-` +
							block.data.alignment +
							`">${block.data.text}</h` +
							block.data.level +
							`>`;
						break;
					case 'image':
						if (
							!isExternalDomain(block.data?.linkUrl) &&
							block.data?.linkUrl !== '' &&
							block.data?.linkUrl !== null
						) {
							newsContent += `<img src="${block.data.file.url}" />`;
						} else if (block.data?.linkUrl === '' || block.data?.linkUrl === null) {
							newsContent += `<img src="${block.data.file.url}" />`;
						}

						break;
					case 'embed':
						newsContent += `<iframe src="${block.data.embed}" width="${block.data.width}" height="${block.data.height}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
						break;
				}
			}
		} catch (e) {
			console.error(e);
			newsContent =  (newsDetail as NewsDetail).content;
		}

		feed.item({
			title: news.title,
			url: rootHost(), // + getBasePath(getPathFromNewsData(transformToNews(news))),
			guid: rootHost(), // + getBasePath(getPathFromNewsData(news)),
			description: news.descriptionMeta,
			date: (newsDetail as NewsDetail).datetime,
			custom_elements: [
				{
					'content:encoded': {
						_cdata: `<img src="${newsImage}" /><br />${(newsDetail as NewsDetail).outline}<br />${newsContent}`,
					},
				},
				{
					'dc:creator':
					(newsDetail as NewsDetail).author && (newsDetail as NewsDetail).author.name ? (newsDetail as NewsDetail).author.name : 'あつめでぃあ編集部',
				},
				{
					'media:thumbnail': {
						_attr: {
							url: newsImage,
						},
					},
				},
				{
					'snf:analytics': {
						_cdata: `<script async src="https://www.googletagmanager.com/gtag/js?id=G-3FGZF1E2BX">window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);gtag('js', new Date());gtag('config', 'G-3FGZF1E2BX');</script>`,
					},
				},
			],
			categories: [news.genreType],
		});
	}

	return new Response(feed.xml({ indent: true }), {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
		},
	});
}
