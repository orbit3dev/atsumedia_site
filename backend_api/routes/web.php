<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\PersonController; // ✅ Explicitly import the controller

Route::get('/clear-log', function () {
    file_put_contents(storage_path('logs/laravel.log'), '');
    return 'Log cleared';
});

// Route::get('/{any}', function (Request $request, $any) { // it should be /{any}
//     $debugInfo = [
// 	'x' => 123,
//         'method'       => $request->method(),
//         'full_url'     => $request->fullUrl(),
//         'uri'          => $request->path(),
//         'params'       => $request->all(),
//         //'headers'      => $request->headers->all(),
//         'route_param'  => $any,
//         'user_agent'   => $request->userAgent(),
//         'ip'           => $request->ip(),
//     ];

//     Log::info('API Catch-All Debug', $debugInfo);
// })->where('any', '.*');

// Route::prefix('test/api')->middleware('api')->group(function () {
//     require base_path('routes/api_routes.php');
// });

	Route::get('/test/api/get-personnel', [PersonController::class, 'getPerson']);
Route::get('/', function () {
    return view('welcome');
});
