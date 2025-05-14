<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AtArticleStatistic;
use App\Models\AtArticle;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class ArticleStatisticController extends Controller
{
    // List all statistics (optional pagination)
    public function index(Request $request)
    {
        $statistics = AtArticleStatistic::query()->paginate(20);
        return response()->json($statistics);
    }

    // Query by parent_article_id_year_week and order by click_count
    public function listByParentArticleIdAndYearWeekAndClickCount(Request $request)
    {
        $parentKey = $request->input('parent_article_id_year_week');
        $statistics = AtArticleStatistic::where('parent_article_id_year_week', $parentKey)
            ->orderByDesc('click_count')
            ->get();

        return response()->json($statistics);
    }

    // Query by genre_type_year_week_tag_type and order by click_count
    public function listByGenreTypeAndYearWeekAndTagTypeAndClickCount(Request $request)
    {
        $key = $request->input('genre_type_year_week_tag_type');
        $statistics = AtArticleStatistic::where('genre_type_year_week_tag_type', $key)
            ->orderByDesc('click_count')
            ->get();

        return response()->json($statistics);
    }

    // Query by year_week_tag_type and order by click_count
    public function listByYearWeekAndTagTypeAndClickCount(Request $request)
    {
        $key = $request->input('year_week_tag_type');
        $statistics = AtArticleStatistic::where('year_week_tag_type', $key)
            ->orderByDesc('click_count')
            ->get();

        return response()->json($statistics);
    }

    public function getArticleStatisticByCountClick(Request $request)
    {
        $parentArticleIdYearWeek = $request->input('parentArticleIdYearWeek');
        $YearWeek = $request->input('YearWeek');
        $parentIds = $request->input('parent_id');
        $tagTypes = $request->input('tagType');
        $limit = $request->input('limit', 10); // Default limit to 10 if not provided

        if (!$parentArticleIdYearWeek) {
            return response()->json(['error' => 'Missing parentArticleIdYearWeek'], 400);
        }

        $articleYearId = explode("-", $parentArticleIdYearWeek);
        $yearId = !empty($articleYearId[1]) ? $articleYearId[1] : '';

        $query = AtArticleStatistic::select([
            'at_article_statistic.article_id AS id',
            'at_article.path_name AS pathName',
            'at_article_genre_type.name AS genreType',
            'at_article_tag_type.name AS tagType',
            'at_article.title',
            'at_article.thumbnail',
            'at_article.title_meta AS titleMeta',
            'at_article.description_meta AS descriptionMeta',
            'at_article.network_id',
            'at_article.thumbnail_url',
            'at_article_statistic.year_week AS yearWeek',
            'at_article_statistic.click_count AS clickCount',
            'at_network.name AS networkName',
        ])
            ->leftJoin('at_article', 'at_article.id', '=', 'at_article_statistic.article_id')
            ->leftJoin('at_article_genre_type', 'at_article.genre_type_id', '=', 'at_article_genre_type.id')
            ->leftJoin('at_article_tag_type', 'at_article.tag_type_id', '=', 'at_article_tag_type.id')
            ->leftJoin('at_network', 'at_article.network_id', '=', 'at_network.id')
            ->orderBy('at_article_statistic.click_count', 'DESC')
            ->limit($limit);
        if ($tagTypes == 'root' || $tagTypes == 'series') {
            if($tagTypes == 'root'){
                $tagChild = '-series';
            } else {
                $tagChild ='-episode';
            }
            $query = $query->where('at_article_statistic.year_week_tag_type', '=', $yearId . $tagChild)
            ->where('at_article.parent_id','=',$parentIds)
            ->get();
        } else if ($tagTypes == 'episode') {
            $dataParent = AtArticle::select(['x.id'])
                ->leftJoin('at_article as x', 'x.parent_id', '=', 'at_article.parent_id')
                ->where('at_article.id', '=', $parentIds)
                ->where('x.id', '!=', $parentIds)
                ->get();
            $ids = collect($dataParent)->pluck('id')->toArray();
            $query = $query->whereIn('at_article_statistic.article_id', $ids)->where('at_article_statistic.year_week', '=', $yearId)->get();
        }

        $response = $query->map(function ($item) {
            if (json_decode($item->thumbnail, true) != '') {
                $thumbnail = json_decode($item->thumbnail, true);
            } else {
                $thumbnail = trim($item->thumbnail, '"');
                $thumbnail = json_decode($thumbnail, true);
            }
            $image_link = env('ABSOLUTE_PATH');
            if (empty($image_link)) {
                $image_link = '/var/www/html/main/wordpress/wp-content/themes/twentytwentyfour/assets/assets/';
            }
            $thumbnail_urls =  !empty($thumbnail['url']) ? $thumbnail['url'] : '';
            $imageTestUrl = $image_link . $thumbnail_urls;
            if (!file_exists($imageTestUrl) || empty($thumbnail_urls)) {
                $thumbnail_urls =  '/public/anime/dummy_thumbnail.png';
            }
            return [
                'yearWeek' => $item->yearWeek,
                'clickCount' => $item->clickCount,
                'article' => [
                    'id' => (string)$item->id,
                    'pathName' => $item->pathName,
                    'genreType' => $item->genreType,
                    'tagType' => $item->tagType,
                    'title' => $item->title,
                    'thumbnail' => [
                        'link' => !empty($thumbnail['link']) ? $thumbnail['link'] : '',
                        'url' => $thumbnail_urls,
                        'text' => !empty($thumbnail['text']) ? $thumbnail['text'] : '',
                    ], // Assuming thumbnail is stored as JSON string
                    'titleMeta' => $item->titleMeta,
                    'descriptionMeta' => $item->descriptionMeta,
                    'network' => [
                        'id' => (int)$item->network_id, // Assuming network_id is an integer
                        'name' => $item->networkName, // Replace with actual network name or logic
                    ]
                ]
            ];
        });
        return response()
            ->json($response, 200, [], JSON_UNESCAPED_UNICODE)
            ->header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
            ->header('Pragma', 'no-cache')
            ->header('Expires', '0');
    }

    public function store(Request $request): JsonResponse
    {
        // Validate the incoming data
        $validated = $request->validate([
            'articleId' => 'required|string',
            'parentArticleId' => 'required|string',
            'genreType' => 'required|string',
            'tagType' => 'required|string',
        ]);

        // Get the current year and week
        $now = now();
        $year = $now->year;
        $week = $now->weekOfYear;
        $yearWeek = (int)($year . $week);

        // Create a unique ID
        $customId = "{$validated['articleId']}-{$yearWeek}";

        // Check if the article statistic already exists
        $articleStatistic = AtArticleStatistic::find($customId);
        if ($articleStatistic) {
            $articleStatistic->update([
                'click_count' => $articleStatistic->click_count + 1,
                'updated_at' => now(),
            ]);
        } else {
            // Create a new article statistic with a custom ID
            $articleStatistic = AtArticleStatistic::create([
                'id' => $customId, // Custom ID
                'article_id' => $validated['articleId'],
                'year_week' => $yearWeek,
                'click_count' => 1,
                'parent_article_id_year_week' => $validated['parentArticleId'] . '-' . $yearWeek,
                'genre_type_year_week_tag_type' => $validated['genreType'] . '-' . $yearWeek . '-' . $validated['tagType'],
                'year_week_tag_type' => $yearWeek . '-' . $validated['tagType'],
            ]);
        }

        // Return response
        return response()->json([
            'data' => [
                'id' => $customId,
                'articleId' => (string) $articleStatistic->article_id,
                'yearWeek' => (int) $articleStatistic->year_week,
                'clickCount' => (int) $articleStatistic->click_count,
                'parentArticleIdYearWeek' => (string) $articleStatistic->parent_article_id_year_week,
                'genreTypeYearWeekTagType' => (string) $articleStatistic->genre_type_year_week_tag_type,
                'yearWeekTagType' => (string) $articleStatistic->year_week_tag_type,
                'createdAt' => $articleStatistic->created_at->toIso8601String(),
                'updatedAt' => $articleStatistic->updated_at->toIso8601String(),
            ]
        ], 200)
            ->header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
            ->header('Pragma', 'no-cache')
            ->header('Expires', '0');
    }
}
