<?php

function isNotNan($value)
{
    return !is_null($value) && strtolower(trim($value)) !== "nan";
}

function getCsvRowCount($csvFile)
{
    $rowCount = 0;
    if (($handle = fopen($csvFile, "r")) !== false) {
        while (fgetcsv($handle) !== false) {
            $rowCount++;
        }
        fclose($handle);
    }
    return $rowCount;
}
?>
