<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use HasFactory;

    protected $table = 'at_news';

    protected $fillable = [
        'author',
        'author_description',
        'author_image',
        'content',
        'created_at',
        'datetime',
        'description_meta',
        'genre_type',
        'genre_type_copy',
        'genre_type_public',
        'image',
        'is_public',
        'is_top',
        'outline',
        'path_name',
        'title',
        'title_date_time',
        'top_public',
        'type',
        'type_name',
        'meta_title',
        'banner',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'title_date_time' => 'datetime',
        'datetime' => 'datetime',
        'genre_type_public' => 'boolean',
        'is_public' => 'boolean',
        'is_top' => 'boolean',
        'top_public' => 'boolean',
    ];
}
