<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArticleController; // ✅ Explicitly import the controller
use App\Http\Controllers\PersonController; // ✅ Explicitly import the controller
use App\Http\Controllers\BannerController; // ✅ Explicitly import the controller
use App\Http\Controllers\NewsController; // ✅ Explicitly import the controller
use App\Http\Controllers\PageSettingController;
use App\Http\Controllers\ArticleStatisticController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Middleware\Log404Request;
use App\Http\Middleware\StripEnvPrefix;

// Register middleware for all API routes
Route::middleware([Log404Request::class])->group(function () {
    // Add your routes here
});

Route::middleware('strip-env')->group(function () {
    // your routes here
    Route::get('/get-person', [PersonController::class, 'getPerson']);
});

Route::prefix('test/api')->group(function () {
    Route::get('/get-person', [PersonController::class, 'getPerson']);
    // other routes...
});


Route::any('/{any}', function (Request $request, $any) {
    $debugInfo = [
        'method'       => $request->method(),
        'full_url'     => $request->fullUrl(),
        'uri'          => $request->path(),
        //'params'       => $request->all(),
        //'headers'      => $request->headers->all(),
        'route_param'  => $any,
        'user_agent'   => $request->userAgent(),
        //'ip'           => $request->ip(),
    ];

    Log::info('API Catch-All Debug', $debugInfo);

    // return response()->json([
    //     'debug' => $debugInfo,
    // ]);
})->where('any', '.*');

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

Route::get('/get-personsss', function () {
    return ['status' => 'ok'];
});
Route::get('/api/get-personsss', function () {
    return ['status' => 'ok1'];
});
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/get-person', [PersonController::class, 'getPerson']);
Route::get('/get-person-ten', [PersonController::class, 'getPerson']);
Route::post('/get-banner', [BannerController::class, 'getBanner']);
Route::post('/get-topic', [BannerController::class, 'getTopic']);
Route::post('/list-by-season-id', [ArticleController::class, 'listBySeasonIdAndTypeSort']);
Route::post('/list-by-genre', [ArticleController::class, 'listByGenre']);
Route::post('/detail-article', [ArticleController::class, 'detailArticle']);
Route::post('/news-list-by-genre', [NewsController::class, 'newsListByGenre']);
Route::post('/get-news-by-path-name', [NewsController::class, 'getNewsByPathName']);
Route::post('/get-article-statistic-by-count-click', [ArticleStatisticController::class, 'getArticleStatisticByCountClick']);
Route::post('/article-statistic', [ArticleStatisticController::class, 'store']);


Route::prefix('article-statistics')->group(function () {
    Route::get('/', [ArticleStatisticController::class, 'index']);
    Route::post('/', [ArticleStatisticController::class, 'store']);
    Route::get('/{id}', [ArticleStatisticController::class, 'show']);
    Route::put('/{id}', [ArticleStatisticController::class, 'update']);
    Route::delete('/{id}', [ArticleStatisticController::class, 'destroy']);

    // Custom Queries
    Route::get('/by-parent', [ArticleStatisticController::class, 'listByParentArticleIdAndYearWeekAndClickCount']);
    Route::get('/by-genre', [ArticleStatisticController::class, 'listByGenreTypeAndYearWeekAndTagTypeAndClickCount']);
    Route::get('/by-yearweek', [ArticleStatisticController::class, 'listByYearWeekAndTagTypeAndClickCount']);
});

Route::get('/', function () {
    $routes = collect(Route::getRoutes())->map(function ($route) {
        return [
            'method' => implode('|', $route->methods()),
            'uri' => $route->uri(),
            'name' => $route->getName(),
            //'action' => $route->getActionName(),
        ];
    });

    return response()->json($routes);
});
// Route::get('/page-settings/{type}', [PageSettingController::class, 'getSettingsByType']);

// Route::get('/person', [PersonController::class, 'index']);
