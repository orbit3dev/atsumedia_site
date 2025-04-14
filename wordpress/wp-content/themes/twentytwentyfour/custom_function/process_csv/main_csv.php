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

if (!defined('ABSPATH')) {
    require_once('../../../../../wp-load.php'); // Adjust the path if needed
}
// require_once "constants/constants.php";

// $csvFile = "csv/data_article.csv";
// $limitRows = 17317;

// if (($handle = fopen($csvFile, "r")) !== false) {
//     fgetcsv($handle);
//     fgetcsv($handle);
//     fgetcsv($handle);
//     $tempParentId = null;

//     $rowCount = 0;
//     while (($data = fgetcsv($handle)) !== false && $rowCount < $limitRows) {
//         // $rowCount = $limitRows;
//         //     break;
//         $rowCount++;
//         $id = isset($data[2]) ? (string) intval($data[2]) : uniqid();

//         $tagType = "root";
//         $tag_type_id = 1;
//         if (isset($data[7]) && ($data[7] != "")) {
//             $tagType = "episode";
//             $tag_type_id = 3;
//             $parentId = $tempParentId;
//         } elseif (isset($data[6]) && ($data[6] != "")) {
//             $tagType = "series";
//             $tag_type_id = 2;
//             $parentId = $tempParentId;
//         } else{
//             $tempParentId = $id;
//         }

//         $articleData = [
//             'id' => $id,
//             'author_organization' => $data[3] ?? "",
//             'category_id' => isset($data[28]) && is_numeric($data[28]) ? (string) intval($data[28]) : "1",
//             'content' => json_encode(["genre" => $data[97] ?? "", "subgenre" => ""], JSON_UNESCAPED_UNICODE),
//             'copyright' => $data[101] ?? "",
//             'created_at' => date("Y-m-d H:i:s"),
//             'description_meta' => $data[11] ?? "",
//             'distributor' => $data[99] ?? "",
//             'distributor_overseas' => $data[100] ?? "",
//             'duration_time' => $data[87] ?? "",
//             'duration_period' => $data[96] ?? "",
//             'staff' => $data[51] ?? "",
//             'network_id' => $data[12] ?? "",
//             'genre_type_id' => Constants::ANIME_GENRE,
//             'summary' => json_encode([
//                 "link" => ['0' => $data[91] ?? ""],
//                 "reference" => $data[105] ?? "",
//                 "text" => $data[30] ?? "",
//                 "title" => $data[29] ?? ""
//             ], JSON_UNESCAPED_UNICODE),
//             'tag' => $tagType,
//             'tag_type_id' => $tag_type_id,
//             'thumbnail' => json_encode(["link" => ['0' => ""], "text" => "", "url" => $data[17] ?? ""], JSON_UNESCAPED_UNICODE),
//             'program_title' => $data[9] ?? "",
//             'title' => $data[9] ?? "",
//             'title_meta' => $data[10] ?? "",
//             'updated_at' => date("Y-m-d H:i:s"),
//             'video_url' => json_encode(["text" => $data[23] ?? "", "url" => $data[24] ?? ""], JSON_UNESCAPED_UNICODE),
//             'volume' => "",
//             'website' => $data[91] ?? "",
//             'path' => $data[9] ?? "",
//             'path_name' => $data[9] ?? "",
//             'sort' => $id,
//             'vod' => $data[26] ?? "",
//             'season_id' => $data[16] ?? "",
//             'parent_id' => $tagType == 'root' ? null : $parentId,
//         ];

//         // insertOrUpdateArticle($conn, $articleData);
//         // $rowCount = $limitRows;
//             // break;

//         //Insert Cast
//         for ($i = 0; $i < 15; $i++) {
//             $castIndex = 53 + ($i * 2);
//             $roleIndex = 54 + ($i * 2);
//             if (!isset($data[$castIndex]) || trim($data[$castIndex]) === "") break;
//             // insertCast($conn, $id, $data[$castIndex], $data[$roleIndex] ?? "");
//         }
//         // if ($id != '21000') {
//         //     // $rowCount = $limitRows;
//         //     continue;
//         // }

//         //Insert Author
//         $authors = [trim($data[32] ?? ""), trim($data[33] ?? "")];
//         foreach ($authors as $author) {
//             // if ($author !== "") insertAuthor($conn, $id, $author);
//         }

//         for ($i = 0; $i < 3; $i++) {
//             $directorIndex = 36 + ($i);
//             if (!isset($data[$directorIndex]) || trim($data[$directorIndex]) === "") break;
//             // insertDirector($conn, $id, $data[$directorIndex] ?? "");
//         }

//         for ($i = 0; $i < 9; $i++) {
//             $producerIndex = 39 + ($i);
//             if (!isset($data[$producerIndex]) || trim($data[$producerIndex]) === "") break;
//             // insertProducer($conn, $id, $data[$producerIndex] ?? "");
//         }

//         for ($i = 0; $i < 2; $i++) {
//             $screenWriterIndex = 48 + ($i);
//             if (!isset($data[$screenWriterIndex]) || trim($data[$screenWriterIndex]) === "") break;
//             // insertScreenWriter($conn, $id, $data[$screenWriterIndex] ?? "");
//         }

//         $arrayProduction = explode(",", $data[51]);
//         for ($index = 0; $index < count($arrayProduction); $index++) {
//             // insertProduction( $id, $arrayProduction[$index] ?? "");
//         }

//         $arrayVod = explode(",", $data[26]);
//         for ($index = 0; $index < count($arrayVod); $index++) {
//             insertVodArticle( $id, $arrayVod[$index] ?? "");
//         }

//         if ($id == '21000') {
//             $rowCount = $limitRows;
//             break;
//         }
//     }

//     fclose($handle);
// }

// $conn->close();
// echo "CSV data inserted or updated in MySQL.\n";


require_once __DIR__ . "/../db/db.php";
require_once __DIR__ . "/../constants/constants.php";
require_once __DIR__ . "/../utils_csv/utils.php";

function process_article_csv($target_input, $limitRows = 17317)
{
    global $wpdb;
    if (!file_exists($target_input)) {
        return ["num_row_processed" => 0, "data" => []];
    }

    $processed_data = [];
    $rowCount = 0;
    $totalRows = getCsvRowCount($target_input);

    if (($handle = fopen($target_input, "r")) !== false) {
        fgetcsv($handle); // Skip first row
        fgetcsv($handle);
        fgetcsv($handle);

        $tempParentId = null;

        while (($data = fgetcsv($handle)) !== false && $rowCount < $totalRows) {
            $rowCount++;

            $id = isset($data[2]) ? (string) intval($data[2]) : uniqid();

            $tagType = "root";
            $titlePath = !empty($data[5]) ? $data[5] : '';
            $tag_type_id = 1;
            $season = !empty($data[6]) ? $data[6] :'';
            if (isset($data[7]) && $data[7] != "") {
                $tagType = "episode";
                $tag_type_id = 3;
                $parentId = $tempParentId;
                $titlePath = $titlePath . '/' . $season . '/' . $data[7];
            } elseif (isset($data[6]) && $data[6] != "") {
                $tagType = "series";
                $tag_type_id = 2;
                $parentId = $tempParentId;
                $titlePath = $titlePath . '/' . $season;
            } else {
                $tempParentId = $id;
                $parentId = null;
            }
            $thumbnailUrl = '';
            if(!empty($data[17])){
                $thumbnailUrl = $data[17];
            } else {
                $thumbnailUrl = 'public/anime/' . $titlePath;
                if(empty($data[6]) && empty($data[7])){
                    //Root
                    $thumbnailUrl = $thumbnailUrl . 'program_thumbnail_' . $id . '.png';
                } elseif(!empty($data[6]) && empty($data[7])){
                    //Series
                    $thumbnailUrl = $thumbnailUrl  . '/series_thumbnail_' . $id . '.png';
                } elseif(!empty($data[6]) && !empty($data[7])){
                    //Episodes
                    $thumbnailUrl = $thumbnailUrl . '/episode_thumbnail_' . $id . '.png';  
                }
            }

            $articleData = [
                'id' => $id,
                'sort' => (int)$id,
                'author_organization' => $data[3] ?? "",
                'program_title' => $data[9] ?? "",
                'title' => $data[9] ?? "",
                'title_meta' => $data[10] ?? "",
                'description_meta' => $data[11] ?? "",
                'network_id' => $data[12] ?? "",
                'season_id' => $data[16] ?? "",
                'thumbnail_url' => $thumbnailUrl,
                'content' => json_encode(["genre" => $data[97] ?? "", "subgenre" => ""], JSON_UNESCAPED_UNICODE),
                'website' => $data[91] ?? "",
                'category_id' => isset($data[28]) && is_numeric($data[28]) ? (string) intval($data[28]) : "1",
                'summary_title' => $data[29] ?? "",
                'summary_text' => $data[30] ?? "",
                'authors' => array_filter([trim($data[32] ?? ""), trim($data[33] ?? "")]),
                'directors' => array_filter(array_map('trim', array_slice($data, 36, 3))),
                'producers' => array_filter(array_map('trim', array_slice($data, 39, 9))),
                'screenwriters' => array_filter(array_map('trim', array_slice($data, 48, 2))),
                // 'cast' => collect_cast($data),
                'production_companies' => array_map('trim', explode(",", $data[51] ?? "")),
                'duration_time' => $data[87] ?? "",
                'duration_period' => $data[96] ?? "",
                'genre' => $data[97] ?? "",
                'distributor' => $data[99] ?? "",
                'distributor_overseas' => $data[100] ?? "",
                'copyright' => $data[101] ?? "",
                'vod_services' => array_map('trim', explode(",", $data[26] ?? "")),
                'video_url' => ["text" => $data[23] ?? "", "url" => $data[24] ?? ""],
                'parent_id' => $parentId,
                'tag' => $tagType,
                'tag_type_id' => $tag_type_id,
                'path' => $titlePath,
                'volume' => "",
                'created_at' => date("Y-m-d H:i:s"),
                'updated_at' => date("Y-m-d H:i:s"),
                'staff' => $data[51] ?? "",
                'vod' => $data[26] ?? "",
                'genre_type_id' => Constants::ANIME_GENRE,
                'summary' => json_encode([
                    "link" => ['0' => $data[91] ?? ""],
                    "reference" => $data[105] ?? "",
                    "text" => $data[30] ?? "",
                    "title" => $data[29] ?? ""
                ], JSON_UNESCAPED_UNICODE),
                'thumbnail' => json_encode(["link" => ['0' => ""], "text" => "", "url" => $thumbnailUrl], JSON_UNESCAPED_UNICODE),

            ];

            $processed_data[] = $articleData;
            // if ($id == '21002') {
                // var_dump($articleData);
                insertOrUpdateArticle($wpdb,$articleData);
            // }
            // 
            //Insert Cast
            for ($i = 0; $i < 15; $i++) {
                $castIndex = 53 + ($i * 2);
                $roleIndex = 54 + ($i * 2);
                if (!isset($data[$castIndex]) || trim($data[$castIndex]) === "") break;
                // insertCast($wpdb, $id, $data[$castIndex], $data[$roleIndex] ?? "");
            }
            // var_dump($articleData);
            if ($id == '21000') {
                // var_dump($data);
            }

            if ($id == '21004') {
                // $rowCount = $limitRows;
                break;
            }

            //Insert Author
            $authors = [trim($data[32] ?? ""), trim($data[33] ?? "")];
            foreach ($authors as $author) {
                // if ($author !== "") insertAuthor($wpdb, $id, $author);
            }

            for ($i = 0; $i < 3; $i++) {
                $directorIndex = 36 + ($i);
                if (!isset($data[$directorIndex]) || trim($data[$directorIndex]) === "") break;
                // insertDirector($wpdb, $id, $data[$directorIndex] ?? "");
            }

            for ($i = 0; $i < 9; $i++) {
                $producerIndex = 39 + ($i);
                if (!isset($data[$producerIndex]) || trim($data[$producerIndex]) === "") break;
                // insertProducer($wpdb, $id, $data[$producerIndex] ?? "");
            }

            for ($i = 0; $i < 2; $i++) {
                $screenWriterIndex = 48 + ($i);
                if (!isset($data[$screenWriterIndex]) || trim($data[$screenWriterIndex]) === "") break;
                // insertScreenWriter($wpdb, $id, $data[$screenWriterIndex] ?? "");
            }

            $arrayProduction = explode(",", $data[51]);
            for ($index = 0; $index < count($arrayProduction); $index++) {
                // insertArticleProduction($wpdb, $id, $arrayProduction[$index] ?? "");
            }

            $arrayVod = explode(",", $data[26]);
            for ($index = 0; $index < count($arrayVod); $index++) {
                // insertVodArticle($wpdb, $id, $arrayVod[$index] ?? "");
            }

            // if ($id == '21041') break;
        }

        fclose($handle);
    }
    // return $rowCount;
    return ["num_row_processed" => $rowCount];
}

function collect_cast($data)
{
    $cast = [];
    for ($i = 0; $i < 15; $i++) {
        $castName = $data[53 + ($i * 2)] ?? "";
        $castRole = $data[54 + ($i * 2)] ?? "";
        if (trim($castName) !== "") {
            $cast[] = ["name" => $castName, "role" => $castRole];
        }
    }
    return $cast;
}
