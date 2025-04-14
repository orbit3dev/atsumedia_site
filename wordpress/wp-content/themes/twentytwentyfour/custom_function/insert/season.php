<?php

if ( !defined('ABSPATH') ) {
    require_once('../../../../../wp-load.php'); // Adjust the path if needed
}

function insertSeason($id, $season) {
    global $wpdb;

    $table_name = $wpdb->prefix . 'season'; // Ensure proper table prefix


    $result = $wpdb->insert(
        $table_name,
        [
            'id' => $id,
            'season' => $season,
            'created_at' => current_time('mysql'),
            'updated_at' => current_time('mysql')
        ],
        ['%s', '%s', '%s', '%s'] // Data format (string, string, datetime, datetime)
    );

    if ($result === false) {
        error_log("Error inserting season: " . $wpdb->last_error);
    }
}
