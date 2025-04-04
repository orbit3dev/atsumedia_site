<?php

require_once __DIR__ . "/../constants/constants.php";
require_once __DIR__ . "/../utils_csv/utils.php";

function process_production_csv($target_input) {
    if (!file_exists($target_input)) {
        return ["num_row_processed" => 0, "data" => []];
    }
    global $conn;

    $processed_data = [];
    $rowCount = 0;
    $totalRows = getCsvRowCount($target_input);

    if (($handle = fopen($target_input, "r")) !== false) {
        fgetcsv($handle);
        fgetcsv($handle);

        while (($data = fgetcsv($handle)) !== false && $rowCount < $totalRows) {
            $rowCount++;
            $production_id = $data[1] ?? "";
            $name = $data[2] ?? "";

            $processed_data[] = [
                "production_id" => $production_id,
                "name" => $name,
                "type" => 'Production',
                "sort" => (int)$production_id,
            ];

        }

        fclose($handle);
    }

    return ["num_row_processed" => $rowCount, "data" => $processed_data];
}

?>
