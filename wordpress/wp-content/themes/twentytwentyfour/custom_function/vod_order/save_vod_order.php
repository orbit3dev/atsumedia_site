<?php
if (!defined('ABSPATH')) {
    require_once('../../../../../wp-load.php'); // Adjust path if needed
}

$vod_ids = isset($_POST['vod_ids']) ? $_POST['vod_ids'] : '';
$article_id = isset($_POST['article_id']) ? (string)$_POST['article_id'] : '';

if (empty($vod_ids) || empty($article_id)) {
    wp_send_json_error('Missing data');
}

$vod_ids = sanitize_text_field($vod_ids);
$article_id = intval($article_id);

global $wpdb;

$table_name = $wpdb->prefix . 'article'; // Assuming the table is 'at_article'
$update_query = $wpdb->prepare(
    "UPDATE $table_name SET custom_vod = %s WHERE id = %d",
    $vod_ids,
    $article_id 
);

$updated = $wpdb->query($update_query);

if ($updated !== false) {
    wp_send_json_success('VOD order updated successfully');
} else {
    wp_send_json_error('Failed to update VOD order');
}
