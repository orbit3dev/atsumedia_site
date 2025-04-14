export type ArticleMusicCsvItem = {
	id: string;
	course: string;
	op_artist: string;
	op_song: string;
	ed_artist: string;
	ed_song: string;
	other_artist: string;
	other_song: string;
};

export type ArticleMusicItem = {
	articleId: string;
	course: number;
	opArtist: string;
	opSong: string;
	edArtist: string;
	edSong: string;
	otherArtist: string;
	otherSon: string;
	type: string;
	sort: number;
	['sort#course']: string;
};
