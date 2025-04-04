<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BannerController extends Controller
{
    public function getBanner(Request $request)
    {

        $type = $request->input('type', 'anime-CAROUSEL'); // Default to 'anime-CAROUSEL'
        $limit = $request->input('limit', 5);

        // Fetch banners from the PageSetting table
        // $banners = DB::table('at_page_setting')
        //     ->whereNotNull('article_id')
        //     ->where('type', 'CAROUSEL')
        //     ->orderBy('sort')
        //     ->limit($limit)
        //     ->get();
        $typePage = ($type == 'banner') ? 'CAROUSEL' : ($type == 'topic' ? 'SPOTLIGHT' : '');
        // Log::info('$request');
        // Log::info($request->all());
        $banners = DB::table('at_page_setting')
            ->leftJoin('at_article', 'at_article.id', '=', 'at_page_setting.article_id')
            ->leftjoin('at_network', 'at_article.network_id', '=', 'at_network.id')
            ->leftjoin('at_article_genre_type', 'at_article_genre_type.id', '=', 'at_article.genre_type_id')
            ->select(
                'at_page_setting.*',
                'at_article.program_title AS title',
                'at_article.title_meta',
                'at_article.path_name',
                'at_article.thumbnail',
                'at_article.thumbnail_link',
                'at_network.name AS network_name',
                'at_article.network_id',
                'at_article_genre_type.name'
            )
            ->where('at_page_setting.type', $typePage)
            ->where('at_page_setting.genre', 'anime')
            ->whereNotNull('at_page_setting.article_id')
            ->orderBy('at_page_setting.article_id', 'ASC')
            ->get();

        // Ensure at least 4 items by duplicating entries
        $list = $banners->toArray();
        if (count($list) > 0 && count($list) < 4) {
            while (count($list) < 4) {
                $list = array_merge($list, $list);
            }
            $list = array_slice($list, 0, 4); // Keep exactly 4 items
        }
        if ($typePage == 'CAROUSEL') {
            $formattedData = $banners->map(function ($banner) {
                $banner->thumbnail = json_decode($banner->thumbnail, true);
                $thumbnail_url = !empty($banner->thumbnail['url']) ? $banner->thumbnail['url'] : '';
                return [
                    'article' => [
                        'id' => (string) $banner->article_id,
                        'genreType' => $banner->genre,
                        'title' => $banner->title ?? 'Unknown Title',
                        'titleMeta' => $banner->title_meta ?? 'No Meta Title',
                        'thumbnail' => [
                            'url' => !empty($banner->thumbnail_url) ? $banner->thumbnail_url : $thumbnail_url, // Include thumbnail URL
                        ],
                        'pathName' => $banner->path_name ?? 'unknown-path',
                    ],
                    'sort' => $banner->sort,
                ];
            });
        } else {
            $formattedData = $banners->map(function ($item) {
                $item->thumbnail = json_decode($item->thumbnail, true);
                $thumbnail_url = !empty($item->thumbnail['url']) ? $item->thumbnail['url'] : '';
                return [
                    'id' => $item->article_id,
                    'pathName' => $item->path_name ?? '', // fallback if null
                    'genreType' => $item->genre,
                    'title' => $item->title ?? '',
                    'titleMeta' => $item->title_meta ?? '',
                    'thumbnail' => [
                        'url' => !empty($item->thumbnail_url) ? $item->thumbnail_url : $thumbnail_url,
                    ],
                    'network' => [
                        'id' => $item->network_id ?? '',
                        'name' => ($item->network_name), // you can create a helper function or join table for this
                    ],
                    'sort' => $item->sort,
                ];
            });
        }

        return response()->json($formattedData);
    }
}
