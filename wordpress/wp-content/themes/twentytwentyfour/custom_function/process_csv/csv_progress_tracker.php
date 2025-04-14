<?php
    $progress_file = 'tmp/csv_progress.json'; // Adjust path if needed

    if (file_exists($progress_file)) {
        $json = file_get_contents($progress_file);
        error_log(json_encode($json));
        echo $json;
    } else {
        echo json_encode(["status" => "not_started"]);
    }