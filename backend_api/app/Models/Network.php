<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Network extends Model
{
    use HasFactory;

    protected $table = 'at_network';

    protected $primaryKey = 'id';
    public $incrementing = false; // Because your `id` is varchar, not auto-increment
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'name',
        'type',
        'sort',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'sort' => 'integer',
    ];
}