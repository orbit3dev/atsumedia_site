<?php
if (!defined('ABSPATH')) {
    require_once('../../../../../wp-load.php'); // Adjust if needed
}

global $wpdb;
header('Content-Type: application/json');
$getParam = !empty($_GET) ? $_GET : [];
$category = !empty($getParam) && !empty($getParam['category']) ? $getParam['category'] : 'anime';
$query_category = "and a.genre = '" . $category . "'";
$type = !empty($getParam) && !empty($getParam['type']) ? $getParam['type'] : 'CAROUSEL';

$results = $wpdb->get_results("
    SELECT a.article_id as id, b.path AS name, b.thumbnail_url AS image
    FROM at_page_setting a
    LEFT JOIN at_article b ON a.article_id = b.id
    WHERE a.type = '" . $type . "' " . $query_category);

$data = [];

foreach ($results as $item) {
    $data[] = [
        'id' => $item->id,
        'text' => $item->name,
        'image' => get_template_directory_uri() . "/assets/assets/" . $item->image
    ];
}

echo json_encode($data);