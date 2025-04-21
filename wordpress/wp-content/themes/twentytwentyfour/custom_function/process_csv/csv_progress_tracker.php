<?php
$progress_file = 'tmp/csv_progress.json'; // Adjust path as needed
$max_attempts = 10;
$wait_ms = 200; // wait 200 milliseconds between retries

function safe_read_json($file, $max_attempts, $wait_ms) {
    while ($max_attempts > 0) {
        if (!file_exists($file)) {
            return json_encode(["status" => "not_started"]);
        }

        clearstatcache(true, $file); // Clear PHP file size cache
        $size = filesize($file);

        if ($size === 0 || $size === false) {
            // wait before retrying
            usleep($wait_ms * 1000);
            $max_attempts--;
            continue;
        }

        $fp = fopen($file, 'r');
        if ($fp && flock($fp, LOCK_SH)) { // Shared lock for reading
            $contents = fread($fp, $size);
            flock($fp, LOCK_UN);
            fclose($fp);

            // Validate JSON
            json_decode($contents);
            if (json_last_error() === JSON_ERROR_NONE) {
                return $contents;
            }
        } elseif ($fp) {
            fclose($fp);
        }

        usleep($wait_ms * 1000);
        $max_attempts--;
    }

    return json_encode(["status" => "reading_failed"]);
}

echo safe_read_json($progress_file, $max_attempts, $wait_ms);
