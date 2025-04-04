<?php

require_once __DIR__ . "/../db/db.php";
require_once __DIR__ . "/../constants/constants.php";
require_once __DIR__ . "/../insert/season.php";
require_once __DIR__ . "/../utils_csv/utils.php";

function process_season_csv($target_input) {
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

            $id = $data[1] ?? "";
            $season = $data[2] ?? "";

            $processed_data[] = ["id" => $id, "season" => $season];
        }

        fclose($handle);
    }


    return ["num_row_processed" => $rowCount, "data" => $processed_data];
}

?>
