<?php

if (!defined('ABSPATH')) {
    require_once('../../../../../wp-load.php'); // Adjust the path if needed
}

function insertPageSetting($articleId, $genre, $type, $notes,$sort)
{
    global $wpdb;

    $table_name = $wpdb->prefix . 'page_setting'; // Ensure proper table prefix
    $sortInt = (int)$sort; // Ensure integer type for sorting

    $result = $wpdb->insert(
        $table_name,
        [
            'article_id' => $articleId,
            'type' => $type,
            'genre' => $genre,
            'sort' => $sortInt,
            'notes' => $notes,
            'created_at' => current_time('mysql'),
            'updated_at' => current_time('mysql')
        ],
        ['%s', '%s', '%s', '%d', '%s', '%s', '%s'] // Data format (string, string, string, integer, string, datetime, datetime)
    );

    if ($result === false) {
        error_log("Error inserting page setting: " . $wpdb->last_error);
    }
}
?>
