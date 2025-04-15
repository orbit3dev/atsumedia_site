<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArticleController; // ✅ Explicitly import the controller
use App\Http\Controllers\PersonController; // ✅ Explicitly import the controller
use App\Http\Controllers\BannerController; // ✅ Explicitly import the controller
use App\Http\Controllers\NewsController; // ✅ Explicitly import the controller
use App\Http\Controllers\PageSettingController;
use App\Http\Controllers\ArticleStatisticController;

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

Route::get('/get-personsss', function () { 
    return ['status' => 'ok'];
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

// Route::get('/page-settings/{type}', [PageSettingController::class, 'getSettingsByType']);

// Route::get('/person', [PersonController::class, 'index']);
