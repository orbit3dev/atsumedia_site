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
        // return response()->json([
        //     'newsList' => 1,
        //     'nextPage' => 2,
        // ]);
        // $request->validate([
        //     'genre_type' => 'required|string',
        //     'limit'      => 'required|integer|min:1|max:100',
        //     'page'       => 'nullable|integer|min:1',
        // ]);

        // $genreType = $request->genre_type . '-1';
        // $limit     = $request->limit;
        // $page      = $request->page ?? 1;
        // $offset    = ($page - 1) * $limit;

        $genreType = 'anime';
        $limit = 10;
        $page = 1;
        $offset    = ($page - 1) * $limit;

        $query = News::where('genre_type', $genreType)
            // ->where('datetime', '<', Carbon::now())
            ->where('is_public', 1)
            ->where('is_top', 1)
            ->select('id', 'title', 'type', 'genre_type as genreType', 'title_meta as titleMeta', 'description_meta', 'image', 'path_name as pathName', 'author')
            ->orderBy('datetime', 'desc');

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

        $query->article = [];
        $query->outline = trim($query->outline,"'");
        $query->content = trim($query->content,"'");

        $query->article = [];
        $query->author = [
            'name' => $query->author,
            'image' => $query->author_image,
            'description' => $query->author_description,
        ];
        unset($query->author_image);
        unset($query->author_description);
        // return $query;
        return response()->json($query, 200, [], JSON_UNESCAPED_UNICODE);
    }
}
