<?php

if ( !defined('ABSPATH') ) {
    require_once('../../../../../wp-load.php'); // Adjust the path if needed
}

function insertProduction($id, $name,$sort, $type) {
    global $wpdb;

    $table_name = $wpdb->prefix . 'production'; // Ensure proper table prefix

    $result = $wpdb->insert(
        $table_name,
        [
            'production_id' => $id,
            'name' => $name,
            'type' => $type,
            'sort' => (int)$sort,
            'created_at' => current_time('mysql'),
            'updated_at' => current_time('mysql')
        ],
        ['%s', '%s', '%s', '%d', '%s', '%s'] 
    );

    if ($result === false) {
        error_log("Error inserting season: " . $wpdb->last_error);
    }
}

function insertArticleProduction($wpdb, $articleId, $productionId)
{

    $table_name = $wpdb->prefix . 'article_production'; // Adjust table name if needed

    $result = $wpdb->insert(
        $table_name,
        [
            'article_id' => $articleId,
            'production_id' => $productionId,
            'created_at' => current_time('mysql'),
            'updated_at' => current_time('mysql')
        ],
        ['%s', '%s', '%s', '%s']
    );

    if ($result === false) {
        error_log("Error inserting production: " . $wpdb->last_error);
    }
}
