<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AtArticleDirector extends Model
{
    use HasFactory;

    protected $table = 'at_article_director';

    protected $fillable = [
        'article_id',
        'person_id',
        'created_at',
        'updated_at'
    ];

    public $incrementing = true; // since id is auto-increment
    protected $keyType = 'int';

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

}
