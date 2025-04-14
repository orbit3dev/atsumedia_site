<?php


function insertScreenwriter($wpdb,$articleId, $personId) {

    $table_name = $wpdb->prefix . 'article_screenwriter'; // Adjust the table name if needed

    $result = $wpdb->insert(
        $table_name,
        [
            'article_id' => $articleId,
            'person_id' => $personId,
            'created_at' => current_time('mysql'),
            'updated_at' => current_time('mysql')
        ],
        ['%s', '%s', '%s', '%s']
    );

    if ($result === false) {
        error_log("Error inserting screenwriter: " . $wpdb->last_error);
    }
}
?>
