<?php


if (!defined('ABSPATH')) {
    require_once('../../../../../wp-load.php'); // Adjust the path if needed
}

function insertVod($id, $name, $microcopy, $custom_microcopy, $url)
{
    global $wpdb;

    $table_name = $wpdb->prefix . 'vod'; // Ensure proper table prefix
    $sort = (int)$id;
    $result = $wpdb->insert(
        $table_name,
        [
            'id' => $id,
            'name' => $name,
            'microcopy' => $microcopy,
            'custom_microcopy' => $custom_microcopy,
            'url' => $url,
            'sort' => $sort,
            'created_at' => current_time('mysql'),
            'updated_at' => current_time('mysql')
        ],
        ['%s', '%s', '%s', '%s', '%s', '%d', '%s', '%s'] // Data format (string, string, string, string, string, datetime, datetime)
    );

    if ($result === false) {
        error_log("Error inserting VOD: " . $wpdb->last_error);
    }
}

function insertVodArticle($wpdb, $articleId, $vodId) {

    $table_name = $wpdb->prefix . 'article_vod'; // Adjust table name if needed

    $result = $wpdb->insert(
        $table_name,
        [
            'article_id' => $articleId,
            'vod_id' => $vodId,
            'created_at' => current_time('mysql'),
            'updated_at' => current_time('mysql')
        ],
        ['%s', '%s', '%s', '%s']
    );

    if ($result === false) {
        error_log("Error inserting VOD article: " . $wpdb->last_error);
    }
}
