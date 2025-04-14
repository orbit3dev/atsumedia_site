<?php

require_once __DIR__ . "/../constants/constants.php";
require_once __DIR__ . "/../utils_csv/utils.php";

function process_page_setting_csv($target_input) {
    if (!file_exists($target_input)) {
        return ["num_row_processed" => 0, "data" => []];
    }
    global $conn;

    $processed_data = [];
    $rowCount = 0;
    $totalRows = getCsvRowCount($target_input);

    if (($handle = fopen($target_input, "r")) !== false) {
        fgetcsv($handle); // Skip first row
        fgetcsv($handle);
        fgetcsv($handle);

        while (($data = fgetcsv($handle)) !== false && $rowCount < $totalRows) {
            $rowCount++;
            $article_id = $data[1] ?? "";
            $genre = $data[2] ?? "";
            $type = $data[3] ?? "";
            $sort = $data[4] ?? "";
            $notes = $data[5] ?? "";

            $processed_data[] = [
                "article_id" => $article_id,
                "genre" => $genre,
                "type" => $type,
                "sort" => $sort,
                "notes" => $notes,
            ];

            // insertPageSetting($id, $genre, $type, $sort, $notes, $createdAt, $updatedAt);
        }

        fclose($handle);
    }

    return ["num_row_processed" => $rowCount, "data" => $processed_data];
}

?>
