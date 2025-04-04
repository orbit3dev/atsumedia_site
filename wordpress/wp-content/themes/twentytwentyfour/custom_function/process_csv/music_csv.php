<?php

require_once "db/db.php";
require_once "constants/constants.php";
require_once "insert/music.php";
require_once "utils_csv/utils.php";

$csvFile = "csv/data_music.csv";

if (($handle = fopen($csvFile, "r")) !== false) {
    fgetcsv($handle); // Skip first row
    fgetcsv($handle);
    fgetcsv($handle);
    $totalRows = getCsvRowCount($csvFile);

    $rowCount = 0;
    while (($data = fgetcsv($handle)) !== false && $rowCount < $totalRows) {
        
        $rowCount++;

        $id = $data[1] ?? "";
        // if($id == '21198'){
        //     var_dump($data);
        //     break;
        // }
        $course = $data[2] ?? "";
        $opArtist = $data[3] ?? "";
        $opSong = $data[4] ?? "";
        $edArtist = $data[5] ?? "";
        $edSong = $data[6] ?? "";
        $otherArtist = $data[7] ?? "";
        $otherSong = $data[8] ?? "";
        $type = 'ArticleMusic';

        // if ($name === "") continue; // Skip empty names

        $createdAt = date("Y-m-d H:i:s");
        $updatedAt = date("Y-m-d H:i:s");

        insertMusic($id, $course, $edArtist, $opArtist, $opSong, $otherArtist , $otherSong , $type, $updatedAt , $createdAt);
    }

    fclose($handle);
}

$conn->close();
echo "CSV data inserted or updated in MySQL.\n";
