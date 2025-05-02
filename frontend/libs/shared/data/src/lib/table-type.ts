import { CategoryType } from '@atsumedia/data';

export enum TagType {
	root = 'root',
	series = 'series',
	episode = 'episode',
}

type MasterType = {
	id: string;
	name: string;
	type: string;
	sort: number;
};

export type Network = {
	articles?: Article[];
} & MasterType;

export type Category = {
	articles?: Article[];
} & MasterType;

export type Production = {
	articleProductions?: Article[];
} & MasterType;

export type Season = {
	articles?: Article[];
} & MasterType;

export type Person = {
	articleCasts?: ArticleCast[];
	articleAuthors?: ArticlePerson[];
	articleDirectors?: ArticlePerson[];
	articleProducers?: ArticlePerson[];
	articleScreenwriters?: ArticlePerson[];
	articleOriginalWorks?: ArticlePerson[];
	image?: string;
} & MasterType;

export type Vod = {
	articles?: Article[];
	microcopy?: string;
	url?: string;
} & MasterType;

export type PageSetting = {
	articleId: string;
	type: string; // eg: anime-CAROUSEL / anime-SPOTLIGHT
	article?: Article;
	sort: number;
};

export type ArticleProduction = {
	articleId: string;
	productionId: string;
	production?: Production;
	article: Article;
};

export type ArticleVod = {
	articleId: string;
	vodId: string;
	vod?: Vod;
	article: Article;
};

export type ArticlePerson = {
	articleId: string;
	personId: string;
	person?: Person;
	article: Article;
};

export type ArticleCast = {
	roleName: string;
} & ArticlePerson;

export type ArticleMusic = {
	type: string;
	articleId: string;
	article?: Article;
	course: number;
	opArtist?: string;
	opSong?: string;
	edArtist?: string;
	edSong?: string;
	otherArtist?: string;
	otherSong?: string;
	sort?: number;
};

export type Article = {
	id: string;
	genreType: CategoryType;
	tagType: TagType;
	pathName: string;
	parentId: string;
	childs?: Article[];
	parent?: Article;
	pageSetting?: PageSetting[];
	title: string;
	titleMeta: string;
	descriptionMeta?: string;
	networkId: string;
	network?: Network;
	seasonId?: string;
	season?: Season;
	thumbnail?: {
		url: string;
		text: string;
		link: string[];
	};
	vods: ArticleVod[];
	categoryId: string;
	category?: Category;
	summary?: {
		title: string;
		text: string;
		reference: string;
		link: string[];
	};
	authors: ArticlePerson[];
	authorOrganiation?: string;
	directors: ArticlePerson[];
	producers: ArticlePerson[];
	screenwriters: ArticlePerson[];
	staff?: string;
	productions: ArticleProduction[];
	otherProduction?: string;
	casts: ArticleCast[];
	sns: string[];
	durationTime?: string;
	seriesNumber?: string;
	publisher?: string;
	otherPublisher?: string;
	website?: string;
	articleOriginalWorks: ArticlePerson[];
	originalWorkOrganization?: string;
	label?: string;
	durationPeriod?: string;
	volume?: string;
	content?: {
		genre: string;
		subgenre: string;
	};
	distributor?: string;
	distributorOverseas?: string;
	copyright?: string;
	productionYear?: string;
	musics?: ArticleMusic[];
	video?: {
		text: string;
		url: string;
	};
	news?: NewsArticle[];
	sort: number;
    freeTexts?: ArticleFreeText[];
	createdAt: string;
	updatedAt: string;
	dubcasts: ArticleCast[];
};

export type FreeText = {
    id: string;
    type: 'advance_cut';
    title: string;
    content: string;
    articles?: ArticleFreeText[];
};

export type ArticleFreeText = {
    id: string;
    articleId: string;
    freeTextId: string;
    article: Article;
    freeText: FreeText;
};

export type ArticleStatistic = {
	articleId: string;
	yearWeek: number;
	genreType: CategoryType;
	tagType: TagType;
	parentArticleId: string;
	clickCount: number;
	article: Article;
};

export type News = {
	id: string;
	title: string;
	type: string;
	datetime: string;
	genreType: CategoryType;
	isTop: number;
	outline: string;
	isPublic: number;
	titleMeta: string;
	descriptionMeta: string;
	content: string;
	image: string;
	pathName: string;
	updatedAt: string;
	articles?: NewsArticle[];
	author?: {
		name: string;
		image: string;
		description: string;
		banner: string;
	};
};

export type NewsArticle = {
	id: string;
	newsId: string;
	articleId: string;
	news: News;
	article: Article;
};
