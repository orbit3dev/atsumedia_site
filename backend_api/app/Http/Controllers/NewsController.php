<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\News;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use League\Csv\Reader;


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
            ->where('is_deleted', 0)
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
            ->where('is_deleted', 0)
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

    public function getUploadData(Request $request)
    {
        set_time_limit(3600);
        ini_set('memory_limit', '2048M');
        mb_internal_encoding('UTF-8');
        ini_set('max_execution_time', '7200');
        $config = DB::table('at_config')->select('path_env')->first();
        if ($config) {
            $pathEnv = $config->path_env;
            // You can now use $pathEnv
        } else {
            $pathEnv = '';
        }

        // try {
        $csvPath = resource_path('csv/trial1.csv');
        $baseImagePath = realpath(base_path('../wordpress/wp-content/themes/twentytwentyfour/assets/assets/news/content/image'));

        $fileContent = file_get_contents($csvPath);
        $fileContent = mb_convert_encoding($fileContent, 'UTF-8', 'auto');
        $lines = explode("\n", $fileContent);

        if (!file_exists($csvPath)) {
            Log::error("CSV file not found at: " . $csvPath);
            return response()->json(['error' => 'CSV file not found'], 404);
        }
        // Get headers (first line)
        $rox = 0;
        $headers = str_getcsv(array_shift($lines));
        foreach ($lines as $index => $rawRow) {
            $rox++;
            if (trim($rawRow) === '') {
                Log::info('skip');
                continue;
            }
            try {
                $latestId = DB::table('at_news')->max('id');
                $newsId = $latestId ? intval($latestId) + 1 : 1;
                $row = $this->parseCsvWithJson($rawRow);

                if (count($row) !== count($headers)) {
                    throw new \Exception("Column count mismatch after JSON parsing");
                }

                $rowData = array_combine($headers, $row);
                $imagePath = $this->downloadAsset(
                    $rowData['image'],
                    $baseImagePath,
                    'content_image',
                    $newsId
                );

                $rawData = $rowData['author'];
                $rawDataAuthor = substr($rawData, 1, -1);
                $rawDataAuthor = str_replace('""', '"', $rawDataAuthor);
                $decodedDataAuthor = json_decode($rawDataAuthor, true); // true to return an associative array
                $imageUrl = $decodedDataAuthor['image']['S'];
                $authorName = $decodedDataAuthor['name']['S'];

                if ($imageUrl === null) {
                    Log::error("Failed to decode author data: " . json_last_error_msg());
                    return null; // or handle the error as appropriate
                }
                $authorImagePath = $this->downloadAsset(
                    $imageUrl,
                    $baseImagePath,
                    'author_image',
                    $newsId
                );

                // Prepare news data
                $dateString = $rowData['createdAt']; // The date string with quotes
                $cleanedDateString = trim($dateString, '"');
                $createdAt = (string)Carbon::parse($cleanedDateString);

                $dateTimeString = $rowData['datetime']; // The date string with quotes
                $cleanedDateString = trim($dateTimeString, '"');
                $dateTimeNews = (string)Carbon::parse($cleanedDateString);

                $outline = $rowData['outline'];
                $outline = substr($outline, 3, -3);
                $outline = str_replace('""""', '"', $outline);

                $description_meta = substr($rowData['descriptionMeta'], 1, -1);
                $description_meta = preg_replace('/[^\x20-\x7E\xA1-\xDF\xE0-\xEF\xFF]/u', '', $description_meta);
                $genre_type = ($rowData['genreType']);
                $path_name = ($rowData['pathName']);
                $title = substr($rowData['title'], 1, -1);
                $type = strtolower(($rowData['type']));
                $titleMeta = (substr($rowData['titleMeta'], 1, -1));
                $titleMeta = preg_replace('/[^\x20-\x7E\xA1-\xDF\xE0-\xEF\xFF]/u', '', $titleMeta);
                $title = preg_replace('/[^\x20-\x7E]/', '', $title);

                $newsData = [
                    'id_author_create' => 1,
                    'username_author_create' => 'admin',
                    'author' => $authorName,
                    'author_description' => $this->extractAuthorDescription($rowData['author']),
                    'author_image' => 'news/content/image/' . $authorImagePath,
                    'content' => $this->transformContent($rowData['content'], $baseImagePath, 'content_image', $newsId, $pathEnv),
                    'created_at' => $createdAt,
                    'datetime' => $dateTimeNews,
                    'description_meta' => $description_meta,
                    'genre_type' => $genre_type,
                    'genre_type_copy' => $genre_type,
                    'genre_type_public' => (bool)$rowData['genreTypePublic'],
                    'image' => 'news/content/image/' . $imagePath,
                    'is_public' => (bool)$rowData['isPublic'],
                    'is_top' => (bool)$rowData['isTop'],
                    'outline' => $outline,
                    'path_name' => $path_name,
                    'title' => $title,
                    'title_date_time' => $dateTimeNews,
                    'top_public' => (bool)$rowData['topPublic'],
                    'type' => $type,
                    'type_name' => $type,
                    'title_meta' => $titleMeta,
                    'meta_title' => $titleMeta,
                    'banner' => null,
                ];
                // Create news entry
                News::create($newsData);
            } catch (\Exception $e) {
                Log::error("Error processing row: " . $e->getMessage());
            }
        }
        return response()->json(['success' => true]);
    }

    private function downloadAsset(string $url, string $basePath, string $type, int $newsId): ?string
    {
        if (empty($url)) {
            Log::info("Empty URL provided for {$type}");
            return null;
        }

        // Step 1: Normalize input
        $url = trim($url, " \t\n\r\0\x0B\""); // Removes whitespace AND quotes
        $basePath = rtrim(str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $basePath), DIRECTORY_SEPARATOR);

        // Step 2: Parse URL and extract file name
        $parsedUrl = parse_url($url);
        if (!isset($parsedUrl['path'])) {
            throw new \Exception("Invalid URL path");
        }

        $originalFileName = trim(basename($parsedUrl['path']), '"');
        $extension = strtolower(trim(pathinfo($originalFileName, PATHINFO_EXTENSION), '"'));

        // Step 3: Validate extension
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        if (!in_array($extension, $allowedExtensions)) {
            throw new \Exception("Unsupported file type: {$extension}");
        }

        // Step 4: Generate minimalist filename e.g. "58_news_1.jpg"
        $existingFiles = glob($basePath . DIRECTORY_SEPARATOR . "{$newsId}_news_*.{jpg,jpeg,png,webp,gif}", GLOB_BRACE);
        $picNumber = count($existingFiles) + 1;
        $fileName = "{$newsId}_news_{$picNumber}.{$extension}";
        $fullPath = $basePath . DIRECTORY_SEPARATOR . $fileName;

        // Step 5: Ensure target directory exists
        if (!file_exists($basePath)) {
            if (!mkdir($basePath, 0755, true)) {
                throw new \Exception("Failed to create directory: {$basePath}");
            }
        }

        // Step 6: Construct full URL to download from
        $baseS3Url = 'https://amplify-d3o1re9c1pbamh-ma-atsumediastoragebucketc5-p4a5475byoag.s3.ap-northeast-1.amazonaws.com/';
        $fullUrl = rtrim($baseS3Url, '/') . '/' . ltrim($url, '/');

        // Step 7: Perform HTTP GET and save file
        $response = Http::timeout(30)->get($fullUrl);
        if (!$response->successful()) {
            throw new \Exception("HTTP request failed with status: {$response->status()}");
        }

        if (file_put_contents($fullPath, $response->body()) === false) {
            throw new \Exception("Failed to write file: {$fullPath}");
        }

        return $fileName;
    }


    private function extractAuthorImageUrl(string $authorJson): ?string
    {
        $data = json_decode($authorJson, true);
        return $data['image']['S'] ?? null;
    }

    private function extractAuthorName(string $authorJson): string
    {
        $data = json_decode($authorJson, true);
        return $data['name']['S'] ?? 'Unknown';
    }

    private function extractAuthorDescription(string $authorJson): string
    {
        $rawDataAuthor = substr($authorJson, 1, -1);
        $rawDataAuthor = str_replace('""', '"', $rawDataAuthor);
        $decodedDataAuthor = json_decode($rawDataAuthor, true);
        return $decodedDataAuthor['description']['S'] ?? '';
    }

    private function transformContent(string $contentJson, string $basePath, string $type, int $newsId, string $pathEnv): string
    {
        $rawJson = substr($contentJson, 3, -3);
        $dataJson = str_replace('""""', '"', $rawJson);
        preg_match_all(
            '#https://amplify-[^"]+\.(jpg|jpeg|png|webp|gif)#i',
            $dataJson,
            $matches
        );

        $foundUrls = array_unique($matches[0]); // Get unique matches to avoid redundant downloads

        foreach ($foundUrls as $url) {
            try {
                $baseS3Url = 'https://amplify-d3o1re9c1pbamh-ma-atsumediastoragebucketc5-p4a5475byoag.s3.ap-northeast-1.amazonaws.com/';
                $image_link = !empty(env('IMAGE_LINK')) ? env('IMAGE_LINK') : $pathEnv;
                $url = str_replace($baseS3Url, '', $url);
                $fileName = $this->downloadAsset($url, $basePath, 'content_image', $newsId);
                if ($fileName) {
                    $dataJson = str_replace($baseS3Url . $url, $image_link . 'news/content/image/' . $fileName, $dataJson);
                }
            } catch (\Exception $e) {
                Log::error("Failed to process content image: " . $e->getMessage());
            }
        }

        return $dataJson;
    }

    protected function parseCsvWithJson(string $csvLine): array
    {
        $tempFile = tmpfile();
        fwrite($tempFile, $csvLine);
        rewind($tempFile);

        $row = [];
        $enclosure = '"';
        $escape = '\\';
        $current = '';
        $inQuotes = false;
        $i = 0;

        while (($char = fgetc($tempFile)) !== false) {
            if ($char === $enclosure && ($i === 0 || $current[$i - 1] !== $escape)) {
                $inQuotes = !$inQuotes;
            } elseif ($char === ',' && !$inQuotes) {
                $row[] = $current;
                $current = '';
                $i = 0;
                continue;
            }

            $current .= $char;
            $i++;
        }
        $row[] = $current; // Add last field
        fclose($tempFile);

        return $row;
    }
}
