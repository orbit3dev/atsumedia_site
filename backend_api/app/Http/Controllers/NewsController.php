<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\News;
use Illuminate\Support\Facades\Log;

class NewsController extends Controller
{
    public function newsListByGenre(Request $request)
    {

        $genreType = !empty($request->genre_type) ? $request->genre_type : 'anime';
        $is_top = !empty($request->is_top) ? $request->is_top : 0;
        $limit = 10;
        $page = 1;
        $offset    = ($page - 1) * $limit;

        $query = News::where('datetime', '<', Carbon::now()) // if it is set for future
            ->where('is_public', 1)
            // ->where('is_top', 1)
            ->select('id', 'title', 'type', 'genre_type as genreType', 'title_meta as titleMeta', 'description_meta', 'image', 'path_name as pathName', 'author')
            ->orderBy('created_at', 'desc');
        if ($request->category != 'public') {
            $query->where('genre_type', $genreType);
        };
        if ($is_top == 1) {
            $query->where('is_top', 1);
        };

        $totalRecords = $query->count();

        $newsList = $query->offset($offset)
            ->limit($limit)
            ->get();

        $hasNextPage = ($offset + $limit) < $totalRecords;
        $nextPage    = $hasNextPage ? $page + 1 : null;
        $dataResult = [
            'newsList' => $newsList,
            'nextToken' => $nextPage,
        ];
        Log::info($dataResult);
        Log::info($dataResult);
        return response()->json($dataResult);

    }

    public function getNewsByPathName(Request $request)
    {
        $slug = $request->slug;
        $query = News::where('path_name', $slug)
            ->where('datetime', '<', Carbon::now())
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
                'image',
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
