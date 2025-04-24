<?php
if (!defined('ABSPATH')) {
    require_once('../../../../../wp-load.php'); // Adjust path if needed
}

global $wpdb;

// Get the article_id from the POST payload and sanitize
$article_id = isset($_POST['article_id']) ? intval($_POST['article_id']) : 0;

$casts = [];

if ($article_id > 0) {
    $query = $wpdb->prepare("SELECT * FROM at_article_cast WHERE article_id = %s ORDER BY sort", $article_id);
    $result = $wpdb->get_results($query);
    error_log(json_encode($result));

    foreach ($result as $row) {
        $casts[] = [
            'cast_id' => $row->id,
            'id' => $row->person_id,
            'role_name' => $row->role_name,
            'sort' => $row->sort
        ];
    }
}

echo json_encode($casts);
