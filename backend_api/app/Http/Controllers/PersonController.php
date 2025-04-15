<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Person;

class PersonController extends Controller
{
    public function getPerson(Request $request)
    {
        $persons = Person::select('*')->limit(10)->get();

        return response()->json($persons);
    }
    public function getPersonTen(Request $request)
    {
        $persons = Person::select('name', 'image', 'sort')
        ->orderBy('sort','asc')
        ->limit(10)
        ->get();

        return response()->json($persons);
    }
}
