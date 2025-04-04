<?php

require_once __DIR__ . "/../db/db.php";
require_once __DIR__ . "/../constants/constants.php";
require_once __DIR__ . "/../insert/person.php";
require_once __DIR__ . "/../utils_csv/utils.php";

function process_person_csv($target_input) {
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

        while (($data = fgetcsv($handle)) !== false && $rowCount < $totalRows) {
            $rowCount++;

            $id = $data[1] ?? "";
            $name = $data[2] ?? "";
            $image = $data[3] ?? "";
            $group = $data[4] ?? "";
            $genre = $data[5] ?? "";
            $role = $data[6] ?? "";
            $sort = (int)$id;
            $type = "Person";
            
            $processed_data[] = ["id" => $id, "image" => $image, "name" => $name, "sort" => $sort, "type" => $type, "group" => $group, "genre" => $genre, "role" => $role,];
        }

        fclose($handle);
    }

    return ["num_row_processed" => $rowCount, "data" => $processed_data];
}

?>
