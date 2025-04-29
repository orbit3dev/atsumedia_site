<?php
require_once __DIR__ . "/../insert/season.php";
require_once __DIR__ . "/../insert/network.php";
require_once __DIR__ . "/../insert/person.php";
require_once __DIR__ . "/../insert/vod.php";
require_once __DIR__ . "/../insert/page_setting.php";
require_once __DIR__ . "/../insert/production.php";
require_once __DIR__ . "/../insert/category.php";
require_once __DIR__ . "/../insert/music.php";
require_once __DIR__ . "/../process_csv/main_csv.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');

    $tableData = json_decode($_POST['tableData'], true);
    $type = ($_POST['file_type']) ? ($_POST['file_type']) : null;
    $filePath = !empty($_POST['file_path']) ?  $_POST['file_path'] : null;
    $type_upload = !empty($_POST['type_upload']) ?  $_POST['type_upload'] : null;
    $processed_data = [];
    $rowCount = 0;
    if ($type != 'article') {
        if ($tableData === null && is_string($_POST['tableData'])) {
            $tableData = json_decode(stripslashes($_POST['tableData']), true);
        }
        if ($tableData === null) {
            error_log("JSON Decode Error: " . json_last_error_msg());
        }
        $file_type = $_POST['file_type'] ?? '';


        if (empty($file_type)) {
            echo json_encode(["error" => "Invalid file type"]);
            exit;
        }

        foreach ($tableData as $data) {
            if ($file_type === 'season_master') {
                $id = $data['id'] ?? "";
                $season = $data['season'] ?? "";

                insertSeason($id, $season);

                $processed_data[] = ["id" => $id, "season" => $season];
            }
            if ($file_type === 'song') {
                error_log($id);
                $id = $data['id'] ?? "";
                $course = $data['course'] ?? "";
                $op_artist = $data['op_artist'] ?? "";
                $op_song = $data['op_song'] ?? "";
                $ed_artist = $data['ed_artist'] ?? "";
                $ed_song = $data['ed_song'] ?? "";
                $other_artist = $data['other_artist'] ?? "";
                $other_song = $data['other_song'] ?? "";
                $type = "ArticleMusic";

                insertMusic($wpdb, $id, $course, $op_artist,  $op_song, $ed_artist, $ed_song, $other_artist, $other_song, $type);


                $processed_data[] = ["id" => $id, "course" => $course];
            }

            if ($file_type === 'broadcast_master') {
                $id = $data['id'] ?? "";
                $name = $data['name'] ?? "";
                insertNetwork($id, $name);
                $processed_data[] = ["id" => $id, "name" => $name];
            }

            if ($file_type === 'cast_master') {
                $id = $data['id'] ?? "";
                $name = $data['name'] ?? "";
                $image =  !empty($id) ? "cast_image_" . $id .".png" : "";
                $group = $data['group'] ?? "";
                $genre = $data['genre'] ?? "";
                $role = $data['role'] ?? "";
                $type = $data['type'] ?? "";
                insertPerson($id, $name, $image, $type, $role, $group, $genre);

                $processed_data[] = [
                    "id" => $id,
                    "image" => $image,
                    "name" => $name,
                    "sort" => (int)$id,
                    "type" => $type,
                    "group" => $group,
                    "genre" => $genre,
                    "role" => $role
                ];
            }
            if ($file_type === 'vod') {
                $id = $data['id'] ?? "";
                $name = $data['name'] ?? "";
                $type = "";
                $microcopy = $data['microcopy'] ?? "";
                $custom_microcopy = $data['custom_microcopy'] ?? "";
                $url = $data['url'] ?? "";
                insertVod($id, $name, $microcopy, $custom_microcopy, $url);

                $processed_data[] = [
                    "id" => $id,
                    "name" => $name,
                    "sort" => (int)$id,
                    "type" => $type,
                    "microcopy" => $microcopy,
                    "custom_microcopy" => $custom_microcopy,
                    "url" => $url
                ];
            }
            if ($file_type === 'page_settings') {
                $article_id = $data['article_id'] ?? "";
                $genre = $data['genre'] ?? "";
                $type = $data['type'];
                $notes = $data['notes'];
                $sort = (int)$data['sort'];

                insertPageSetting($article_id,  $genre, $type, $notes, $sort);

                $processed_data[] = [
                    "article_id" => $article_id,
                    "genre" => $genre,
                    "sort" => (int)$sort,
                    "type" => $type,
                    "notes" => $notes,
                ];
            }
            if ($file_type === 'production') {
                $production_id = $data['production_id'] ?? "";
                $name = $data['name'] ?? "";
                $sort = $data['sort'] ?? "";
                $type = $data['type'] ?? "";


                insertProduction($production_id,  $name, $sort, $type);

                $processed_data[] = [
                    "production_id" => $production_id,
                    "name" => $name,
                    "sort" => $sort,
                    "type" => $type,
                ];
            }
            if ($file_type === 'category') {
                $id = $data['id'] ?? "";
                $name = $data['name'] ?? "";
                $sort = $data['sort'] ?? "";
                $type = $data['type'] ?? "";


                insertCategory($id,  $name, $sort, $type);

                $processed_data[] = [
                    "id" => $id,
                    "name" => $name,
                    "sort" => $sort,
                    "type" => $type,
                ];
            }

            $rowCount++;
        }
        $matchFile = isset($result['match_file']) ? $result['match_file'] : true;
    } else {
        if (!empty($filePath)) {
            $start = microtime(true);
            $result = process_article_csv($filePath , $type_upload);
            $end = microtime(true);
            $duration = $end - $start;
            error_log('Execution time :' . round($duration, 4) . "seconds");
            $processed_data = [];
            $rowCount = $result['num_row_processed'];
            $matchFile = isset($result['match_file']) ? $result['match_file'] : true;
        } else {
            echo json_encode(["error" => "File Path Not Found"]);
            exit;
        }
    }



    echo json_encode(["message" => "Processed $rowCount rows.", "data" => $processed_data , "match_file" => $matchFile]);
    exit;
}
