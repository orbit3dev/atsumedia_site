<?php
if (!defined('ABSPATH')) {
    require_once('../../../../../wp-load.php'); // Adjust the path if needed
}
require_once __DIR__ . "/../constants/constants.php";

global $wpdb;
if (function_exists('wp_cache_flush')) {
    wp_cache_flush(); // Clears the object cache.
}

$term = isset($_GET['term']) ? sanitize_text_field($_GET['term']) : '';
$page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
$category = isset($_GET['category']) ? $_GET['category'] : 'public';
$per_page = 10;
$offset = ($page - 1) * $per_page;

// Replace this with your actual table name and column names
$table_name = $wpdb->prefix . 'article';

// Build query
$like_query = $wpdb->esc_like($term) . '%';
$genre_query = "and genre_type_id = " . Constants::CATEGORY[$category] . "";
if($category =='public'){
    $genre_query = '';
}

$query = "SELECT id, vod, path as name, thumbnail_url as image FROM $table_name WHERE path LIKE %s and path <> ''  $genre_query  ORDER BY name ASC LIMIT %d OFFSET %d";
$sql = $wpdb->prepare(
    $query,
    $like_query,
    $per_page + 1, 
    $offset
);

$results = $wpdb->get_results($sql);

$more = count($results) > $per_page;
if ($more) {
    array_pop($results); // Remove extra item
}
$response = [
    'results' => array_map(function ($row) {
        return [
            'id' => $row->id,
            'text' => $row->name,
            'image' => get_template_directory_uri() . '/assets/assets/'. $row->image .'?v='. time(),
            'vod' => $row->vod,
        ];
    }, $results),
    'more' => $more
];

header('Content-Type: application/json');
echo json_encode($response);
exit;
