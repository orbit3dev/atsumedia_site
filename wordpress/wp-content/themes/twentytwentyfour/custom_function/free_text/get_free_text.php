<?php
if (!defined('ABSPATH')) {
    require_once('../../../../../wp-load.php'); // Adjust the path if needed
}

global $wpdb;

$article_id = $_GET['article_id']; // Get article_id from the URL or request

// Prepare the query to retrieve the content based on article_id
$query = $wpdb->prepare(
    "SELECT free_text_id, content FROM {$wpdb->prefix}article_free_text WHERE article_id = %d LIMIT 1",
    $article_id
);

// Execute the query
$result = $wpdb->get_row($query);

if ($result) {
    // If the article exists, decode the content and return as JSON
    echo json_encode(['blocks' => json_decode($result->content)]);
} else {
    // If no data found, return empty content
    echo json_encode(['blocks' => []]);
}
