<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AtArticleMusic extends Model
{
    use HasFactory;

    protected $table = 'at_article_music';

    protected $fillable = [
        'type',
        'article_id',
        'course',
        'op_artist',
        'op_song',
        'ed_artist',
        'ed_song',
        'other_artist',
        'other_song',
        'sort',
        'created_at',
        'updated_at',
        'article_id_course',
    ];

    public $incrementing = true; // 'id' is auto-increment
    protected $keyType = 'int';

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
