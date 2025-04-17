<?php
if (!defined('ABSPATH')) {
    require_once('../../../../../wp-load.php'); // Adjust if needed
}

global $wpdb;
header('Content-Type: application/json');

// Get multiple initial articles
$results = $wpdb->get_results("
    SELECT a.article_id as id, b.path AS name, b.thumbnail_url AS image
    FROM at_page_setting a
    LEFT JOIN at_article b ON a.article_id = b.id
    WHERE a.type = 'CAROUSEL'
");

$data = [];

foreach ($results as $item) {
    $data[] = [
        'id' => $item->id,
        'text' => $item->name,
        'image' => get_template_directory_uri() . "/assets/assets/" . $item->image
    ];
}

echo json_encode($data);