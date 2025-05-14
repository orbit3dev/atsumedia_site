<?php

require_once __DIR__ . "/../constants/constants.php";
require_once __DIR__ . "/../utils_csv/utils.php";

function process_distributor_csv($target_input)
{
    if (!file_exists($target_input)) {
        return ["num_row_processed" => 0, "data" => []];
    }
    global $conn;

    $processed_data = [];
    $rowCount = 0;
    $totalRows = getCsvRowCount($target_input);

    if (($handle = fopen($target_input, "r")) !== false) {
        fgetcsv($handle); // Skip header 1
        fgetcsv($handle); // Skip header 2

        while (($data = fgetcsv($handle)) !== false && $rowCount < $totalRows) {
            $rowCount++;
            $distributor_id = $data[1] ?? "";
            $name = $data[2] ?? "";

            $processed_data[] = [
                "id" => $distributor_id,
                "name" => $name,
                "type" => 'Distributor',
                "sort" => (int)$distributor_id,
            ];
        }

        fclose($handle);
    }

    return ["num_row_processed" => $rowCount, "data" => $processed_data];
}
