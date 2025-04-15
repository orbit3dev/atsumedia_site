<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vod extends Model
{
    use HasFactory;

    protected $table = 'at_vod'; // keep the table name as is

    protected $fillable = [
        'id',
        'name',
        'type',
        'sort',
        'microcopy',
        'custom_microcopy',
        'url',
        'created_at',
        'updated_at'
    ];

    protected $keyType = 'string';
    public $incrementing = false;

    protected $casts = [
        'microcopy' => 'string',
        'custom_microcopy' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
