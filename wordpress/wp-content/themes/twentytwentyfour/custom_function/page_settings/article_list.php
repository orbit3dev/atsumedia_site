<?php
if (!defined('ABSPATH')) {
    require_once('../../../../../wp-load.php'); // Adjust the path if needed
}

global $wpdb;

$term = isset($_GET['term']) ? sanitize_text_field($_GET['term']) : '';
$page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
$per_page = 10;
$offset = ($page - 1) * $per_page;

// Replace this with your actual table name and column names
$table_name = $wpdb->prefix . 'article';

// Build query
$like_query = $wpdb->esc_like($term) . '%';

$sql = $wpdb->prepare(
    "SELECT id, path as name, thumbnail_url as image FROM $table_name WHERE path LIKE %s and path <> '' ORDER BY name ASC LIMIT %d OFFSET %d",
    $like_query,
    $per_page + 1, // Get 1 extra row to check if there's more
    $offset
);

$results = $wpdb->get_results($sql);

// Check if there is a next page
$more = count($results) > $per_page;
if ($more) {
    array_pop($results); // Remove extra item
}
$images1 = "http://localhost/wordpress/assets/public/anime/dandadan/season1/episode10/episode_thumbnail_29131.png";
// Format for Select2
$response = [
    'results' => array_map(function ($row) {
        return [
            'id' => $row->id,
            'text' => $row->name,
            // 'image' => get_site_url() . "/assets/" . $row->image,
            // 'image' => "http://localhost/wordpress/assets/public/anime/dandadan/season1/episode10/episode_thumbnail_29131.png",
            'image' => get_template_directory_uri() . '/assets/assets/'. $row->image,
        ];
    }, $results),
    'more' => $more
];

header('Content-Type: application/json');
echo json_encode($response);
exit;
