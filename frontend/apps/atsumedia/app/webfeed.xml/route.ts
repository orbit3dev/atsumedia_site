import RSS from 'rss';
import { getBasePath, rootHost, isExternalDomain, isAdvertisement } from '../_lib/config';
import { getRssNewsList, getPathFromNewsData, getNewsByPathName } from './_lib/fetchData';
import sanitizeHtml from 'sanitize-html';

export async function GET() {
	const newsList = await getRssNewsList(15); // Limit 15 for now, can be changed later.

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
			newsDetail?.image !== null || newsDetail?.image !== undefined
				? '/' + newsDetail?.image
				: rootHost() + getBasePath('/public/anime/dummy_thumbnail2.png');

		let newsContent = '';
		try {
			const newsBlock = JSON.parse(newsDetail.content);
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
			newsContent = newsDetail.content;
		}

		feed.item({
			title: news.title,
			url: rootHost() + getBasePath(getPathFromNewsData(news)),
			guid: rootHost() + getBasePath(getPathFromNewsData(news)),
			description: news.descriptionMeta,
			date: newsDetail.datetime,
			custom_elements: [
				{
					'content:encoded': {
						_cdata: `<img src="${newsImage}" /><br />${newsDetail.outline}<br />${newsContent}`,
					},
				},
				{
					'dc:creator':
						newsDetail.author && newsDetail.author.name ? newsDetail.author.name : 'あつめでぃあ編集部',
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
