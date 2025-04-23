<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AtArticleFreeText extends Model
{
    use HasFactory;

    protected $table = 'at_article_free_text';

    public $incrementing = false; // composite primary key, so no auto-increment
    protected $primaryKey = null; // disable default 'id' key handling

    protected $fillable = [
        'article_id',
        'free_text_id',
        'content',
        'type',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'article_id' => 'integer',
        'free_text_id' => 'integer',
        'content' => 'string',
        'type' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public $timestamps = true;
}
