<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BannerController extends Controller
{
    public function getBanner(Request $request)
    {

        $type = $request->input('type', 'banner');
        $limit = $request->input('limit', 5);
        $category = $request->input('category', 'anime');

        $cat = 'anime';
        if ($category == 'アニメ') {
            $cat = 'anime';
        } else if ($category == '映画') {
            $cat = 'movie';
        } else if ($category == '国内ドラマ') {
            $cat = 'drama_japan';
        } else if ($category == '海外ドラマ') {
            $cat = 'drama_global';
        } else if ($category == 'public') {
            $cat = 'public';
        }

        $typePage = ($type == 'banner') ? 'CAROUSEL' : ($type == 'topic' ? 'SPOTLIGHT' : '');
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
                'at_article.thumbnail_url',
                'at_network.name AS network_name',
                'at_article.network_id',
                'at_article_genre_type.name as genre_name'
            )
            ->where('at_page_setting.type', $typePage)
            ->where('at_page_setting.genre', $cat)
            ->whereNotNull('at_page_setting.article_id')
            ->orderBy('at_page_setting.sort', 'ASC')
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
                if ($banner->genre == 'public') {
                    $banner->genre = $banner->genre_name;
                }
                $thumbnail = !empty($banner->thumbnail) && is_string($banner->thumbnail) ? json_decode($banner->thumbnail, true) : '';
                $image_link = env('ABSOLUTE_PATH');
                if (empty($image_link)) {
                    $image_link = '/var/www/html/main/wordpress/wp-content/themes/twentytwentyfour/assets/assets/';
                }
                $thumbnail_urls =  !empty($thumbnail) && (!empty($thumbnail['url'])) ? $thumbnail['url'] : (!empty($banner->thumbnail_url) ? $banner->thumbnail_url : '');
                $imageTestUrl = $image_link . $thumbnail_urls;
                if (!file_exists($imageTestUrl)) {
                    $thumbnail_urls =  '/public/anime/dummy_thumbnail.png';
                }
                return [
                    'article' => [
                        'id' => (string) $banner->article_id,
                        'genreType' => $banner->genre,
                        'title' => $banner->title ?? 'Unknown Title',
                        'titleMeta' => $banner->title_meta ?? 'No Meta Title',
                        'thumbnail' => [
                            'url' => $thumbnail_urls,
                        ],
                        'pathName' => $banner->path_name ?? 'unknown-path',
                    ],
                    'sort' => $banner->sort,
                ];
            });
        } else {
            $formattedData = $banners->map(function ($item) {
                $item->thumbnail = json_decode($item->thumbnail, true);
                $thumbnail = !empty($item->thumbnail) && is_string($item->thumbnail) ? json_decode($item->thumbnail, true) : '';
                if ($item->genre == 'public') {
                    $item->genre = $item->genre_name;
                }
                $image_link = env('ABSOLUTE_PATH');
                if (empty($image_link)) {
                    $image_link = '/var/www/html/main/wordpress/wp-content/themes/twentytwentyfour/assets/assets/';
                }
                $thumbnail_urls =  !empty($thumbnail) && (!empty($thumbnail['url'])) ? $thumbnail['url'] : (!empty($item->thumbnail_url) ? $item->thumbnail_url : '');
                $imageTestUrl = $image_link . $thumbnail_urls;
                if (!file_exists($imageTestUrl)) {
                    $thumbnail_urls =  '/public/anime/dummy_thumbnail.png';
                }
                return [
                    'id' => $item->article_id,
                    'pathName' => $item->path_name ?? '', // fallback if null
                    'genreType' => $item->genre,
                    'title' => $item->title ?? '',
                    'titleMeta' => $item->title_meta ?? '',
                    'thumbnail' => [
                        'url' => $thumbnail_urls, // Include thumbnail URL
                    ],
                    'network' => [
                        'id' => $item->network_id ?? '',
                        'name' => ($item->network_name), // you can create a helper function or join table for this
                    ],
                    'sort' => $item->sort,
                ];
            });
        }

        return response()->json($formattedData)
            ->header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
            ->header('Pragma', 'no-cache')
            ->header('Expires', '0');
    }
}
