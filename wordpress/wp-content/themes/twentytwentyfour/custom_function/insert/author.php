<?php

if ( !defined('ABSPATH') ) {
    require_once('../../../../../wp-load.php'); // Adjust the path if needed
}

function insertAuthor($wpdb, $articleId, $personId) {

    $author_table = $wpdb->prefix . 'article_author';
    $original_work_table = $wpdb->prefix . 'article_original_work';

    // Insert into article_author
    $author_result = $wpdb->insert(
        $author_table,
        [
            'article_id' => $articleId,
            'person_id' => $personId,
            'created_at' => current_time('mysql'),
            'updated_at' => current_time('mysql')
        ],
        ['%s', '%s', '%s', '%s']
    );

    if ($author_result === false) {
        error_log("Error inserting author: " . $wpdb->last_error);
    }

    // Insert into article_original_work
    $original_work_result = $wpdb->insert(
        $original_work_table,
        [
            'article_id' => $articleId,
            'person_id' => $personId,
            'created_at' => current_time('mysql'),
            'updated_at' => current_time('mysql')
        ],
        ['%s', '%s', '%s', '%s']
    );

    if ($original_work_result === false) {
        error_log("Error inserting original work: " . $wpdb->last_error);
    }
}
?>
