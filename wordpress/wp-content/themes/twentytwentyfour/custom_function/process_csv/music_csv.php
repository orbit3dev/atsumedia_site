<?php

// require_once __DIR__ . "/../db/db.php";
require_once __DIR__ . "/../constants/constants.php";
require_once __DIR__ . "/../insert/music.php";
require_once __DIR__ . "/../utils_csv/utils.php";

function process_music_csv($target_input) {
    if (!file_exists($target_input)) {
        return ["num_row_processed" => 0, "data" => []];
    }

    $processed_data = [];
    $rowCount = 0;
    $totalRows = getCsvRowCount($target_input);

    if (($handle = fopen($target_input, "r")) !== false) {
        fgetcsv($handle); // Skip first row
        $kanji_headers = fgetcsv($handle);
        $headers = fgetcsv($handle);

        if ( !in_array("オープニング_制作", $kanji_headers) && !in_array("主題歌_制作", $kanji_headers) ) {
            return ["num_row_processed" => 0, 'data'=> [], 'match_file' => false];
        }

        while (($data = fgetcsv($handle)) !== false && $rowCount < $totalRows) {
            $rowCount++;

            $id = $data[1] ?? "";
            $course = $data[2] ?? "";
            $opArtist = $data[3] ?? "";
            $opSong = $data[4] ?? "";
            $edArtist = $data[5] ?? "";
            $edSong = $data[6] ?? "";
            $otherArtist = $data[7] ?? "";
            $otherSong = $data[8] ?? "";
            $type = 'ArticleMusic';

            $createdAt = date("Y-m-d H:i:s");
            $updatedAt = date("Y-m-d H:i:s");

            $processed_data[] = [
                "id" => $id,
                "course" => $course,
                "op_artist" => $opArtist,
                "op_song" => $opSong,
                "ed_artist" => $edArtist,
                "ed_song" => $edSong,
                "other_artist" => $otherArtist,
                "other_song" => $otherSong,
                "type" => $type,
                "created_at" => $createdAt,
                "updated_at" => $updatedAt,
            ];
        }

        fclose($handle);
    }

    return ["num_row_processed" => $rowCount, "data" => $processed_data,'match_file' => true];
}
