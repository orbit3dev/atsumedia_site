<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Middleware\Log404Request;
use App\Http\Controllers\PersonController; // ✅ Explicitly import the controller

Route::get('/x', function (Request $request, $any) {
    $debugInfo = [
	'x' => 123,
        'method'       => $request->method(),
        'full_url'     => $request->fullUrl(),
        'uri'          => $request->path(),
        'params'       => $request->all(),
        //'headers'      => $request->headers->all(),
        'route_param'  => 555,
        'user_agent'   => $request->userAgent(),
        'ip'           => $request->ip(),
    ];

    Log::info('API Catch-All Debug', $debugInfo);

    // return response()->json([
    //     'debug' => $debugInfo,
    // ]);
})->where('any', '.*');

	Route::get('/test/api/get-person', [PersonController::class, 'getPerson']);
Route::get('/', function () {
    return view('welcome');
});
