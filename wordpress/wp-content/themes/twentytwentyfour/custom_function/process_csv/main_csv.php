<?php

// require_once "db/db.php";
// require_once "utils_csv/utils.php";
require_once "../insert/article.php";
require_once "../insert/cast.php";
require_once "../insert/author.php";
require_once "../insert/director.php";
require_once "../insert/producer.php";
require_once "../insert/screenwriter.php";
require_once "../insert/production.php";
require_once "../insert/vod.php";
require_once __DIR__ . "/../db/db.php";
require_once __DIR__ . "/../constants/constants.php";
require_once __DIR__ . "/../utils_csv/utils.php";

if (!defined('ABSPATH')) {
    require_once('../../../../../wp-load.php'); // Adjust the path if needed
}

function process_article_csv($target_input, $type_upload,  $limitRows = 17317, $progress_file = "tmp/csv_progress.json")
{
    global $wpdb;

    if (!file_exists($target_input)) {
        return ["num_row_processed" => 0, "data" => []];
    }
    error_log(123);
    $processed_data = [];
    $rowCount = 0;

    if (($handle = fopen($target_input, "r")) !== false) {

        // Fetch headers
        fgetcsv($handle); // Optional skip line
        fgetcsv($handle); // Optional skip line
        $headers = fgetcsv($handle); // Get actual headers

        if (!in_array("program_title", $headers) && !in_array("production_year", $headers) && !in_array("title_path", $headers) && !in_array("publisher", $headers) && !in_array("vod", $headers)) {
            file_put_contents($progress_file, json_encode([
                "status" => "done",
                "processed" => 0,
                "total" => 0
            ]));
            return ["num_row_processed" => 0, 'match_file' => false];
        }
        $limitRows = getCsvRowCount($target_input);
        if ($type_upload == 1) {
            $idArticle = $wpdb->get_results("SELECT id FROM at_article ORDER BY id ASC", ARRAY_A); // ARRAY_A returns associative array
            $idArticleArr = array_column($idArticle, 'id');
        }
        // return ["num_row_processed" => 0];

        file_put_contents($progress_file, json_encode([
            "status" => "processing",
            "processed" => 0,
            "total" => 0
        ]));


        $tempParentId = null;

        while (($row = fgetcsv($handle)) !== false && $rowCount < $limitRows) {
            $data = array_combine($headers, $row);
            // if (!$data || $row[0] == '入力不可' || $row[0] == '' || $row[0] == null || $row[0] == '使用不可') {
            if (!$data || $row[0] == '入力不可' || $row[0] == '使用不可' ) {
                $rowCount++;
                continue;
            }

            if($data['program_title'] == '' || empty($data['program_title'])){
                $rowCount++;
                continue;
            }

            $id = isset($data['id']) ? (string)($data['id']) : uniqid();
            if ($type_upload == 1) {
                if (($key = array_search($id, $idArticle)) !== false) {
                    unset($idArticleArr[$key]);
                    continue;
                }
            }
            if ($type_upload == 3) {
                if (($key = array_search($id, $idArticle)) == true) {
                    unset($idArticleArr[$key]);
                    continue;
                }
            }

            file_put_contents($progress_file, json_encode([
                "status" => "processing",
                "processed" => $rowCount,
                "total" => $limitRows,
            ]));

            $rowCount++;

            // Determine tag type
            $tagType = "root";
            $titlePath = $data['title_path'] ?? '';
            $tag_type_id = 1;
            $season = $data['series_path'] ?? '';

            if (!empty($data['episode_path'])) {
                $tagType = "episode";
                $tag_type_id = 3;
                $seasonParentid = get_transient($titlePath . '/' . $season);
                $titlePath .= '/' . $season . '/' . $data['episode_path'];
                if (!empty($seasonParentid)) {
                    $parentId = $seasonParentid;
                } else {
                    $parentId = $tempParentId;
                }
            } elseif (!empty($season)) {
                $tagType = "series";
                $tag_type_id = 2;
                $parentId = $tempParentId;
                $titlePath .= '/' . $season;
                set_transient($titlePath, $id, 3600); // cache for 1 hour
            } else {
                $tempParentId = $id;
                $parentId = null;
            }
            $categoryName = 'anime';
            if($data['genre'] == 'アニメ'){
                $genre_type_id = Constants::CATEGORY['anime'];
                $categoryName = 'anime';
            } elseif($data['genre'] == '映画'){
                $genre_type_id = Constants::CATEGORY['movie'];
                $categoryName = 'movie';

            } elseif($data['genre'] == '国内ドラマ'){
                $genre_type_id = Constants::CATEGORY['drama_japan'];
                $categoryName = 'drama_japan';
            };

            // Thumbnail
            $thumbnailUrl = !empty($data['thumbnail']) && !empty($titlePath) ? $data['thumbnail'] : ('public/' . $categoryName . '/' . $titlePath);
            $thumbnailUrl = ('public/'. $categoryName . '/' . $titlePath);
            if (empty($data['series_path']) && empty($data['episode_path'])) {
                $thumbnailUrl .= '/program_thumbnail_' . $id . '.png';
            } elseif (!empty($data['series_path']) && empty($data['episode_path'])) {
                $thumbnailUrl .= '/series_thumbnail_' . $id . '.png';
            } elseif (!empty($data['series_path']) && !empty($data['episode_path'])) {
                $thumbnailUrl .= '/episode_thumbnail_' . $id . '.png';
            }
            // $thumbnailUrl = $titlePath .'/' . $id;
            $articleData = [
                'id' => $id,
                'sort' => (int)$id,
                'author_organization' => $data['author_organiation'] ?? "",
                'program_title' => $data['program_title'] ?? "",
                'title' => $data['title_path'] ?? "",
                'title_meta' => $data['title_meta'] ?? "",
                'description_meta' => $data['description_meta'] ?? "",
                'network_id' => $data['network_1'] ?? "",
                'season_id' => $data['season'] ?? "",
                'series_number' => $data['series_number'] ?? "",
                'thumbnail_url' => $thumbnailUrl,
                'content' => json_encode(["genre" => $data['content_genre'] ?? "", "subgenre" => ""], JSON_UNESCAPED_UNICODE),
                'website' => $data['website'] ?? "",
                'category_id' => isset($data['category']) && is_numeric($data['category']) ? (string)intval($data['category']) : "1",
                'summary_title' => $data['summary_title'] ?? "",
                'summary_text' => $data['summary_text'] ?? "",
                'authors' => array_filter([trim($data['author_1'] ?? ""), trim($data['author_2'] ?? "")]),
                'directors' => array_filter([trim($data['director_1'] ?? ""), trim($data['director_2'] ?? ""), trim($data['director_3'] ?? "")]),
                'producers' => array_filter(array_map('trim', [
                    $data['producer_1'] ?? "",
                    $data['producer_2'] ?? "",
                    $data['producer_3'] ?? "",
                    $data['producer_4'] ?? "",
                    $data['producer_5'] ?? "",
                    $data['producer_6'] ?? "",
                    $data['producer_7'] ?? "",
                    $data['producer_8'] ?? "",
                    $data['producer_9'] ?? "",
                    $data['producer_10'] ?? "",
                    $data['producer_11'] ?? "",
                ])),
                'screenwriters' => array_filter([trim($data['screenwriter_1'] ?? ""), trim($data['screenwriter_2'] ?? "")]),
                'production_companies' => array_map('trim', explode(",", $data['production_1'] ?? "")),
                'duration_time' => $data['duration_time'] ?? "",
                'duration_period' => $data['duration_period'] ?? "",
                'genre' => $data['content_genre'] ?? "",
                'distributor' => $data['distributor'] ?? "",
                'distributor_overseas' => $data['distributor_overseas'] ?? "",
                'copyright' => $data['copyright'] ?? "",
                'label' => $data['label'] ?? "",
                'production_year' => $data['production_year'] ?? "",
                'publisher' => $data['publisher'] ?? "",
                'series_number' => $data['series_number'] ?? "",
                'other_production' => $data['production_2'] ?? "",
                'other_publisher' => $data['other_publisher'] ?? "",
                'vod_services' => array_map('trim', explode(",", $data['vod'] ?? "")),
                'video_url' => $data['video_url'] ?? "",
                'video_text' => $data['video_text'] ?? "",
                'parent_id' => $parentId,
                'tag' => $tagType,
                'tag_type_id' => $tag_type_id,
                'path' => $titlePath,
                'path_name' => $titlePath,
                'volume' => $data['volume'] ?? "",
                'created_at' => date("Y-m-d H:i:s"),
                'updated_at' => date("Y-m-d H:i:s"),
                'staff' => $data['staff'] ?? "",
                'vod' => $data['vod'] ?? "",
                'genre_type_id' => $genre_type_id,
                'summary' => json_encode([
                    "link" => ['0' => $data['website'] ?? ""],
                    "reference" => $data['summary_reference'] ?? "",
                    "text" => $data['summary_text'] ?? "",
                    "title" => $data['summary_title'] ?? ""
                ], JSON_UNESCAPED_UNICODE),
                'summary_title' => $data['summary_title'] ?? "",
                'summary_text' => $data['summary_text'] ?? "",
                'summary_reference' => $data['summary_reference'] ?? "",
                'summary_link' => $data['summary_link'] ?? "",
                'sns' => json_encode([
                    '0' => $data['sns_1'] ?? "",
                    '1' => $data['sns_2'] ?? "",
                    '2' => $data['sns_3'] ?? "",
                ], JSON_UNESCAPED_UNICODE),
                'thumbnail' => json_encode([
                    "link" => ['0' => ""],
                    "text" => $data['thumbnail_text'] ?? '',
                    "url" => $thumbnailUrl
                ], JSON_UNESCAPED_UNICODE),
                'flag_series' =>  $data['flag_series'] ?? '',
                'canonical' =>  $data['canonical'] ?? '',
                'broadcast_day' =>  $data['broadcast_day'] ?? '',
                'weekday' =>  $data['weekday'] ?? '',
                'stream_day' =>  $data['stream_day'] ?? '',
                'kana' =>  $data['kana'] ?? '',
                'original_title' =>  $data['original_title'] ?? '',
                'primary_program' =>  $data['primary_program'] ?? '',
                'distribution' =>  $data['distribution'] ?? '',
                'production_country' =>  $data['production_country'] ?? '',
                'dubcast' => json_encode([
                    "dubcast_1" => $data['dubcast_1'] ?? '',
                    "dubcast_2" => $data['dubcast_2'] ?? '',
                    "dubcast_3" => $data['dubcast_3'] ?? '',
                    "dubcast_4" => $data['dubcast_4'] ?? '',
                    "dubcast_5" => $data['dubcast_5'] ?? '',
                    "dubcast_6" => $data['dubcast_6'] ?? '',
                    "dubcast_7" => $data['dubcast_7'] ?? '',
                    "dubcast_8" => $data['dubcast_8'] ?? '',
                    "dubcast_9" => $data['dubcast_9'] ?? '',
                    "dubcast_10" => $data['dubcast_10'] ?? '',
                    "dubcast_11" => $data['dubcast_11'] ?? '',
                    "dubcast_12" => $data['dubcast_12'] ?? '',
                    "dubcast_13" => $data['dubcast_13'] ?? '',
                    "dubcast_14" => $data['dubcast_14'] ?? '',
                    "dubcast_15" => $data['dubcast_15'] ?? '',
                ], JSON_UNESCAPED_UNICODE),
                'dubcast_role' => json_encode([
                    "dubcast_role_1" => $data['dubcast_role_1'] ?? '',
                    "dubcast_role_2" => $data['dubcast_role_2'] ?? '',
                    "dubcast_role_3" => $data['dubcast_role_3'] ?? '',
                    "dubcast_role_4" => $data['dubcast_role_4'] ?? '',
                    "dubcast_role_5" => $data['dubcast_role_5'] ?? '',
                    "dubcast_role_6" => $data['dubcast_role_6'] ?? '',
                    "dubcast_role_7" => $data['dubcast_role_7'] ?? '',
                    "dubcast_role_8" => $data['dubcast_role_8'] ?? '',
                    "dubcast_role_9" => $data['dubcast_role_9'] ?? '',
                    "dubcast_role_10" => $data['dubcast_role_10'] ?? '',
                    "dubcast_role_11" => $data['dubcast_role_11'] ?? '',
                    "dubcast_role_12" => $data['dubcast_role_12'] ?? '',
                    "dubcast_role_13" => $data['dubcast_role_13'] ?? '',
                    "dubcast_role_14" => $data['dubcast_role_14'] ?? '',
                    "dubcast_role_15" => $data['dubcast_role_15'] ?? '',
                ], JSON_UNESCAPED_UNICODE),
                'executive_producer' => json_encode([
                    "executive_producer_1" => $data['executive_producer_1'] ?? '',
                    "executive_producer_2" => $data['executive_producer_2'] ?? '',
                    "executive_producer_3" => $data['executive_producer_3'] ?? '',
                ], JSON_UNESCAPED_UNICODE),
            ];

            

            $processed_data[] = $articleData;

            // Step 2: Dynamic CSV row handling

            // === Insert Cast (cast_1 to cast_15)
            for ($i = 1; $i <= 15; $i++) {
                $castKey = "cast_$i";
                $roleKey = "cast_role_$i";
                if (!isset($castKey)) continue;

                $castName = trim($data[$castKey] ?? "");
                $castRole = trim($data[$roleKey] ?? "");

                if ($castName === "") break;
                insertCast($wpdb, $id, $castName, $castRole);
            }

            // === Insert Authors (author_1 to author_3)
            for ($i = 1; $i <= 3; $i++) {
                $authorKey = "author_$i";
                if (!isset($authorKey)) continue;

                $authorName = trim($data[$authorKey] ?? "");
                if ($authorName === "") continue;
                insertAuthor($wpdb, $id, $authorName);
            }

            // === Insert Directors (director_1 to director_3)
            for ($i = 1; $i <= 3; $i++) {
                $directorKey = "director_$i";
                if (!isset($directorKey)) continue;

                $director = trim($data[$directorKey] ?? "");
                if ($director === "") continue;
                insertDirector($wpdb, $id, $director);
            }

            // === Insert Producers (producer_1 to producer_9)
            for ($i = 1; $i <= 9; $i++) {
                $producerKey = "producer_$i";
                if (!isset($producerKey)) continue;

                $producer = trim($data[$producerKey] ?? "");

                if ($producer === "") continue;
                insertProducer($wpdb, $id, $producer);
            }

            // === Insert Screenwriters (screenwriter_1 to screenwriter_2)
            for ($i = 1; $i <= 2; $i++) {
                $writerKey = "screenwriter_$i";
                if (!isset($writerKey)) continue;

                $writer = trim($data[$writerKey] ?? "");
                if ($writer === "") continue;

                insertScreenWriter($wpdb, $id, $writer);
            }

            // === Insert Production Companies (comma-separated in production_1)
            if (isset($data['production_1'])) {
                $production = trim($data['production_1'] ?? "");
                $arrayProduction = explode(",", $production);
                foreach ($arrayProduction as $company) {
                    $company = trim($company);
                    if ($company !== "") {
                        // insertArticleProduction($wpdb, $id, $company);
                    }
                }
            }

            // === Insert VOD Platforms (comma-separated in vod)
            if (isset($data['vod'])) {
                $vodData = trim($data['vod'] ?? "");
                $arrayVod = explode(",", $vodData);
                foreach ($arrayVod as $vod) {
                    $vod = trim($vod);
                    if ($vod !== "") {
                        insertVodArticle($wpdb, $id, $vod);
                    }
                }
            }

            insertOrUpdateArticle($wpdb, $articleData);
        }
        fclose($handle);
    }
    file_put_contents($progress_file, json_encode([
        "status" => "done",
        "processed" => $rowCount,
        "total" => ($type_upload == 2) ? $limitRows : $rowCount,
    ]));

    return ["num_row_processed" => $rowCount, 'match_file' => true];
}
