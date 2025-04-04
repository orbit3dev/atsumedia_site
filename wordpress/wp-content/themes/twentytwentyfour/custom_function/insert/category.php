<?php

if ( !defined('ABSPATH') ) {
    require_once('../../../../../wp-load.php'); // Adjust the path if needed
}

function insertCategory($id, $name,$sort, $type) {
    global $wpdb;

    $table_name = $wpdb->prefix . 'category'; // Ensure proper table prefix


    $result = $wpdb->insert(
        $table_name,
        [
            'id' => $id,
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