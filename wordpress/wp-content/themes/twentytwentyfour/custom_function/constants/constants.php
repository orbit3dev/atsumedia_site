<?php
class Constants
{
    public const TABLE_ARTICLE = "at_article";
    public const TABLE_CAST = "at_article_cast";
    public const TABLE_AUTHOR = "at_article_author";
    public const ANIME_GENRE = 1;
    public const SEASON_COLUMNS = ['id', 'season'];
    public const SEASON_COLUMNS_JP = ['ID', 'シーズン'];
    public const BROADCAST_COLUMNS = ['id', 'name'];
    public const PERSON_COLUMNS = ['id', 'name', 'sort', 'type','group', 'genre' , 'role'];
    public const PERSON_COLUMNS_JP = ['ID','名前', '並び順', 'タイプ', 'グループ', 'ジャンル', '役割'];
    public const VOD_COLUMNS = ['id', 'name', 'type', 'sort', 'microcopy','custom_microcopy', 'url'];
    public const VOD_COLUMNS_JP = ['ID', '名前', 'タイプ', '並び順', 'マイクロコピー', 'カスタムマイクロコピー', 'URL'];
    public const PAGE_SETTINGS_COLUMNS = ['article_id','genre','type','sort','notes'];
    public const PAGE_SETTINGS_COLUMNS_JP = ['記事ID', 'ジャンル', 'タイプ', '並び順', '備考'];
    public const PRODUCTION_COLUMNS = ['production_id','name','type','sort'];
    public const PRODUCTION_COLUMNS_JP = ['制作ID', '名前', 'タイプ', '並び順'];
    public const CATEGORY_COLUMNS = ['id','name','type','sort'];
    public const CATEGORY_COLUMNS_JP = ['カテゴリID', '名前', 'タイプ', '並び順'];
    public const MUSIC_COLUMNS = ['id','course','op_artist','op_song','ed_artist','ed_song','other_artist','other_song'];
    public const MUSIC_COLUMNS_JP = ['ID','クール','オープニング_制作','オープニング_曲','エンディング_制作','エンディング_曲','その他音楽_制作','その他音楽_曲'];

    public const BROADCAST_COLUMNS_JP = ['ID', 'カテゴリ名'];
    public const ARTICLE_COLUMNS = [
        'id',
        'author_organization',
        'category_id',
        'content',
        'copyright',
        'created_at',
        'description_meta',
        'distributor',
        'distributor_overseas',
        'duration_time',
        'duration_period',
        'staff',
        'summary',
        'tag',
        'thumbnail',
        'program_title',
        'title_meta',
        'updated_at',
        'video_url',
        'volume',
        'website',
        'path',
        'genre_type_id',
        'tag_type_id',
        'vod',
        'parent_id',
        'network_id',
        'season_id'
    ];
    public const ARTICLE_COLUMNS_JP = [];
    public const CATEGORY = [
        'anime' => 1,
        'movie' => 2,
        'drama_japan' => 3,
        'drama_global' => 4,
    ];
}

const TABLE_NETWORK = "at_network";
const TABLE_MUSIC = "at_article_music";
const COL_TYPE = "Network";