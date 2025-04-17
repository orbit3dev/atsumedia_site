<?php
$uploadDir = '/tmp/';
$filename = $uploadDir . basename($_FILES['csv_file']['name']);
move_uploaded_file($_FILES['csv_file']['tmp_name'], $filename);

$progress_file = '/tmp/csv_progress.json';
file_put_contents($progress_file, json_encode([
    "status" => "queued",
    "processed" => 0,
    "total" => 0
]));

require_once 'your_processor_file.php';
$result = process_article_csv($filename, 999999, $progress_file);

echo json_encode(['success' => true]);
