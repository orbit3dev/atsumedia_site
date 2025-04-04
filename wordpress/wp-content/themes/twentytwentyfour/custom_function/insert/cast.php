<?php


function insertCast($wpdb, $articleId, $personId, $roleName) {

    $table_name = $wpdb->prefix . 'article_cast'; // Ensure proper table prefix

    $result = $wpdb->insert(
        $table_name,
        [
            'article_id' => $articleId,
            'person_id' => $personId,
            'role_name' => $roleName,
            'created_at' => current_time('mysql'),
            'updated_at' => current_time('mysql')
        ],
        ['%s', '%s', '%s', '%s', '%s'] // Data format
    );

    if ($result === false) {
        error_log("Error inserting cast: " . $wpdb->last_error);
    }
}
