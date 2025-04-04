<?php

if ( !defined('ABSPATH') ) {
    require_once('../../../../../wp-load.php'); // Adjust the path if needed
}

function insertDirector($wpdb,$articleId, $personId) {

    $table_name = $wpdb->prefix . 'article_director'; // Adjust the table name if needed

    $result = $wpdb->insert(
        $table_name,
        [
            'article_id' => $articleId,
            'person_id' => $personId,
            'created_at' => current_time('mysql'),
            'updated_at' => current_time('mysql')
        ],
        ['%s', '%s', '%s', '%s'] // Data formats
    );

    if ($result === false) {
        error_log("Error inserting director: " . $wpdb->last_error);
    }
}
?>
