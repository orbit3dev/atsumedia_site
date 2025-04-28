<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Season extends Model
{
    use HasFactory;

    protected $table = 'at_season'; // explicit table name

    protected $fillable = [
        'season',
        'created_at',
        'updated_at'
    ];

    public $incrementing = true;
    protected $keyType = 'int';

    protected $casts = [
        'season' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
