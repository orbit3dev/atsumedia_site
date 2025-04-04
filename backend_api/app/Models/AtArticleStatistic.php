<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AtArticleStatistic extends Model
{
    protected $table = 'at_article_statistic';
    protected $primaryKey = 'id';
    public $incrementing = false; // Because it's char(36)
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'article_id',
        'year_week',
        'click_count',
        'parent_article_id_year_week',
        'genre_type_year_week_tag_type',
        'year_week_tag_type',
        'created_at',
        'updated_at',
    ];

    public function article()
    {
        return $this->belongsTo(AtArticle::class, 'article_id', 'id');
    }

    // Query Scopes to replicate secondary indexes behavior:
    public function scopeListByParentArticleIdAndYearWeekAndClickCount($query, $parentIdYearWeek)
    {
        return $query->where('parent_article_id_year_week', $parentIdYearWeek)
                     ->orderByDesc('click_count');
    }

    public function scopeListByGenreTypeAndYearWeekAndTagTypeAndClickCount($query, $genreTypeYearWeekTagType)
    {
        return $query->where('genre_type_year_week_tag_type', $genreTypeYearWeekTagType)
                     ->orderByDesc('click_count');
    }

    public function scopeListByYearWeekAndTagTypeAndClickCount($query, $yearWeekTagType)
    {
        return $query->where('year_week_tag_type', $yearWeekTagType)
                     ->orderByDesc('click_count');
    }
}
