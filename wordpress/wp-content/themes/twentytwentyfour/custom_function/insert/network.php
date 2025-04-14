<?php

if (!defined('ABSPATH')) {
    require_once('../../../../../wp-load.php'); // Adjust the path if needed
}

function insertNetwork($id, $name)
{
    global $wpdb;

    $table_name = $wpdb->prefix . 'network'; // Ensure proper table prefix
    $sort = (int)$id;
    $result = $wpdb->insert(
        $table_name,
        [
            'id' => $id,
            'name' => $name,
            'type' => 'Network',
            'sort' => $sort,
            'created_at' => current_time('mysql'),
            'updated_at' => current_time('mysql')
        ],
        ['%s', '%s', '%s', '%d', '%s', '%s'] // Data format (string, string, string, integer, datetime, datetime)
    );

    if ($result === false) {
        error_log("Error inserting network: " . $wpdb->last_error);
    }
}
