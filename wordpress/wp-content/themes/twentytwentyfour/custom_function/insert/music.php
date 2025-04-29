<?php

if (!defined('ABSPATH')) {
    require_once('../../../../../wp-load.php'); // Adjust path as needed
}

function insertMusic($wpdb, $articleId, $course, $edArtist, $opArtist, $opSong, $otherArtist, $otherSong, $type)
{
    $table = $wpdb->prefix . 'article_music';

    $result = $wpdb->insert(
        $table,
        [
            'article_id'     => $articleId,
            'course'         => $course,
            'ed_artist'      => $edArtist,
            'op_artist'      => $opArtist,
            'op_song'        => $opSong,
            'other_artist'   => $otherArtist,
            'other_song'     => $otherSong,
            'sort'           => $articleId, // Assuming sort = article_id
            'type'           => $type,
            'updated_at'     => current_time('mysql'),
            'created_at'     => current_time('mysql')
        ],
        [
            '%s', '%d', '%s', '%s', '%s', '%s', '%s', '%d', '%s', '%s', '%s'
        ]
    );

    if ($result === false) {
        error_log("Error inserting music: " . $wpdb->last_error);
    }

    return $result;
}
