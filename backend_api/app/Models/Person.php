<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Person extends Model
{
    use HasFactory;

    protected $table = 'at_person'; // Adjust table name if needed
    protected $fillable = ['id', 'name', 'type', 'sort' , 'image' , 'role' , 'group_person' , 'genre']; // Add only necessary fields
}
