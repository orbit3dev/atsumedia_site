<?php
// Load WordPress environment
require_once('../../../../../wp-load.php'); // Adjust the path if needed
require_once "../constants/constants.php";


// Set content type to JSON
header('Content-Type: application/json');

$manual_entry = isset($_POST['manual_entry']) && $_POST['manual_entry'] === 'true';
$file_type = sanitize_text_field($_POST['file_type']);

if ($manual_entry) {
    if ($file_type === 'season_master') {
        $columns = Constants::SEASON_COLUMNS; // Ensure proper column mapping
        $columns_jp = Constants::SEASON_COLUMNS_JP; // Ensure proper column mapping
        echo json_encode(['columns' => $columns, 'data' => [], 'columns_jp' => $columns_jp]);
        exit;
    }
    if ($file_type === 'broadcast_master') {
        $columns = Constants::BROADCAST_COLUMNS; // Ensure proper column mapping
        $columns_jp = Constants::BROADCAST_COLUMNS_JP; // Ensure proper column mapping
        echo json_encode(['columns' => $columns, 'data' => [], 'columns_jp' => $columns_jp]);
        exit;
    }
    if ($file_type === 'cast_master') {
        $columns = Constants::PERSON_COLUMNS; // Ensure proper column mapping
        $columns_jp = Constants::PERSON_COLUMNS_JP; // Ensure proper column mapping
        echo json_encode(['columns' => $columns, 'data' => [], 'columns_jp' => $columns_jp]);
        exit;
    }
    if ($file_type === 'article') {
        $columns = Constants::ARTICLE_COLUMNS; // Ensure proper column mapping
        $columns_jp = Constants::ARTICLE_COLUMNS_JP; // Ensure proper column mapping
        echo json_encode(['columns' => $columns, 'data' => [], 'columns_jp' => $columns_jp , $type = 'article']);
        exit;
    }
    if ($file_type === 'song') {
        $columns = Constants::MUSIC_COLUMNS; // Ensure proper column mapping
        $columns_jp = Constants::MUSIC_COLUMNS_JP; // Ensure proper column mapping
        echo json_encode(['columns' => $columns, 'data' => [], 'columns_jp' => $columns_jp]);
        exit;
    }
    if ($file_type === 'distributor') {
        $columns = Constants::DISTRIBUTOR_COLUMNS; // Ensure proper column mapping
        $columns_jp = Constants::DISTRIBUTOR_COLUMNS_JP; // Ensure proper column mapping
        echo json_encode(['columns' => $columns, 'data' => [], 'columns_jp' => $columns_jp]);
        exit;
    }
}

// Handle AJAX request
if (!isset($_FILES['csv_file']) || !isset($_POST['file_type'])) {
    echo json_encode(['error' => 'No file uploaded or file type missing.']);
    exit;
}

$file = $_FILES['csv_file'];
$upload_dir = wp_upload_dir();
$target_file = $upload_dir['path'] . '/' . basename($file['name']);

if (move_uploaded_file($file['tmp_name'], $target_file)) {
    $result = custom_process_csv_function($target_file, $file_type);


    if (isset($result['error'])) {
        echo json_encode(['error' => $result['error']]);
    } else {
        echo json_encode($result);
    }
} else {
    echo json_encode(['error' => 'Failed to upload file.']);
}

exit; // End execution to prevent any further output
