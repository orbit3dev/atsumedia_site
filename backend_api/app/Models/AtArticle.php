<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AtArticle extends Model
{
    use HasFactory;

    protected $table = 'at_article'; // keep the table name as is

    protected $fillable = [
        'id', 'genre_type_id', 'tag_type_id', 'path_name', 'parent_id',
        'title', 'title_meta', 'description_meta', 'network_id', 'season_id',
        'thumbnail_url', 'thumbnail_text', 'thumbnail_link', 'category_id',
        'summary_title', 'summary_text', 'summary_reference', 'summary_link',
        'author_organization', 'staff', 'other_production', 'sns',
        'duration_time', 'series_number', 'publisher', 'other_publisher',
        'website', 'original_work_organization', 'label', 'duration_period',
        'volume', 'content_genre', 'content_subgenre', 'distributor',
        'distributor_overseas', 'copyright', 'production_year', 'video_text',
        'video_url', 'vod', 'sort', 'content', 'summary', 'tag',
        'program_title', 'thumbnail', 'path', 'created_at', 'updated_at'
    ];

    protected $casts = [
        'thumbnail_link' => 'array',
        'summary_link' => 'array',
        'sns' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Optional relationships if needed in the future
    public function parent()
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function childs()
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    // ✅ Your existing index or scopes will stay exactly as they are
}
