////////////////////////////////////////////////////////////////////////////////////////////
// genreとcategoryについて
//
// categoryはアニメ、映画、国内ドラマ、海外ドラマなどを表し、genreはそれらをさらに細かく分類したものですが、
// CSVファイルやDynamoDBのテーブルや項目名で"genre"と"category"が逆になっています。
// このためソースコード上もネーミングが逆になっている箇所があり、注意してください。
// 修正できるタイミングで修正していってください。
////////////////////////////////////////////////////////////////////////////////////////////

// 注意: libs/amplify-backend/amplify/data/resource.ts のgenreTypeと合わせること
export type CategoryType = 'anime' | 'movie' | 'drama_japan' | 'drama_global';

type Category = {
    /** 表示名 */
	name: string;
    /** 色(小文字で指定) */
	color: string;
    /** head - title */
	title: string;
    /** meta - description */
	description: string;
    /** タイプ(slugに使用) */
	type: CategoryType;
};

const categories: Category[] = [
	{
		type: 'anime',
		name: 'アニメ',
		color: '#00b2bd',
		title: 'アニメ配信情報/番組情報 | あつめでぃあ',
		description:
			'アニメの動画配信情報や放送日、キャスト/声優/原作者/制作会社などの番組情報を掲載！『あつめでぃあ』は@S[アットエス]が運営する総合メディア情報サイトです。',
	},
	{
		type: 'movie',
		name: '映画',
		color: '#2f8fea',
		title: '映画公開情報/配信情報 | あつめでぃあ',
		description:
			'映画の公開情報や動画配信情報、キャスト/スタッフ/配給会社などの情報を掲載！『あつめでぃあ』は@S[アットエス]が運営する総合メディア情報サイトです。',
	},
	{
		type: 'drama_japan',
		name: '国内ドラマ',
		color: '#53bb2e',
		title: '国内ドラマ配信情報/番組情報 | あつめでぃあ',
		description:
			'国内ドラマの動画配信情報や放送日、キャスト/スタッフ/原作者/放送局などの番組情報を掲載！『あつめでぃあ』は@S[アットエス]が運営する総合メディア情報サイトです。',
	},
	{
		type: 'drama_global',
		name: '海外ドラマ',
		color: '#f5a52c',
		title: '海外ドラマ配信情報/番組情報 | あつめでぃあ',
		description:
			'海外ドラマの動画配信情報や、キャスト/スタッフ/制作国などの番組情報を掲載！『あつめでぃあ』は@S[アットエス]が運営する総合メディア情報サイトです。',
	},
];

/**
 * カテゴリーを取得する
 * @param type カテゴリータイプ
 * @returns
 */
export const getCategoryByType = (type: CategoryType): Category => {
	for (const value of categories) {
		if (value.type === type) {
			return value;
		}
	}
	throw new Error('Category not found');
};

export const getCategoryColorByType = (type: CategoryType): string => {
	for (const value of categories) {
		if (value.type === type) {
			return value.color;
		}
	}
	throw new Error('Category color not found');
};

export type KeyValue = {
	key: string;
	value: string;
};

export const categoryList = categories.map((value) => ({
	key: value.type,
	value: value,
}));

export const genreList = categoryList.map((item) => item.key);
