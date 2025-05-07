<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\News;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;


class NewsController extends Controller
{
    public function newsListByGenre(Request $request)
    {
        $genreType = !empty($request->genre_type) ? $request->genre_type : 'anime';
        $is_top = !empty($request->is_top) ? $request->is_top : 0;
        $limit = 10;
        $page = 1;
        $offset = ($page - 1) * $limit;

        $query = News::where('datetime', '<', Carbon::now())
            ->where('is_public', 1)
            // ->where('is_deleted', 0)
            ->select(
                'id',
                'title',
                'type',
                'genre_type as genreType',
                'title_meta as titleMeta',
                'description_meta',
                'image', // raw for now, logic applied later
                'path_name as pathName',
                'author'
            )
            ->orderBy('created_at', 'desc');

        if ($request->category != 'public') {
            $query->where('genre_type', $genreType);
        }
        if ($is_top == 1) {
            $query->where('is_top', 1);
        }

        $totalRecords = $query->count();

        $newsList = $query->offset($offset)
            ->limit($limit)
            ->get();

        // Image checking
        $image_link = env('ABSOLUTE_PATH');
        if (empty($image_link)) {
            $image_link = '/var/www/html/test/wordpress/wp-content/themes/twentytwentyfour/assets/assets/';
        }

        $newsList = $newsList->map(function ($item) use ($image_link) {
            $thumbnail = $item->image;
            $testPath = $image_link . $thumbnail;
            if (empty($thumbnail) || !file_exists($testPath)) {
                $item->image = '/public/anime/dummy_thumbnail.png';
            }

            return $item;
        });

        $hasNextPage = ($offset + $limit) < $totalRecords;
        $nextPage = $hasNextPage ? $page + 1 : null;
        return response()->json([
            'newsList' => $newsList,
            'nextToken' => $nextPage,
        ]);
    }

    public function getNewsByPathName(Request $request)
    {
        $slug = $request->slug;
        $query = News::where('path_name', $slug)
            ->where('datetime', '<', Carbon::now())
            // ->where('is_deleted', 0)
            ->select(
                'id',
                'title',
                'type',
                'datetime',
                'genre_type as genreType',
                'is_top as isTop',
                'outline',
                'content',
                'title_meta as titleMeta',
                'description_meta as descriptionMeta',
                DB::raw("CASE WHEN image IS NULL OR image = '' THEN '/public/anime/dummy_thumbnail.png' ELSE image END as image"),
                'updated_at as updatedAt',
                'path_name as pathName',
                'author',
                'author_image',
                'author_description',
            )
            ->first();

        if (!empty($query)) {
            $query->article = [];
            $query->outline = trim($query->outline, "'");
            $query->content = trim($query->content, "'");

            $query->article = [];
            $query->author = [
                'name' => $query->author,
                'image' => $query->author_image,
                'description' => $query->author_description,
            ];
            unset($query->author_image);
            unset($query->author_description);
        }

        return response()->json($query, 200, [], JSON_UNESCAPED_UNICODE);
    }
}
