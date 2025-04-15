<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Middleware\Log404Request;
Route::any('/{any}', function (Request $request, $any) {
    $debugInfo = [
        'method'       => $request->method(),
        'full_url'     => $request->fullUrl(),
        'uri'          => $request->path(),
        'params'       => $request->all(),
        'headers'      => $request->headers->all(),
        'route_param'  => $any,
        'user_agent'   => $request->userAgent(),
        'ip'           => $request->ip(),
    ];

    Log::info('API Catch-All Debug', $debugInfo);

    // return response()->json([
    //     'debug' => $debugInfo,
    // ]);
})->where('any', '.*');

Route::get('/', function () {
    return view('welcome');
});
