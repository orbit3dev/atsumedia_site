<?php

if (!defined('ABSPATH')) {
    require_once('../../../../../wp-load.php'); // Adjust path as needed
}

function insertMusic($wpdb, $articleId, $course, $opArtist, $opSong,  $edArtist,  $edSong, $otherArtist, $otherSong, $type)
{
    $table = $wpdb->prefix . 'article_music';

    $data = [
        'article_id'     => $articleId,       // Unique key
        'course'         => $course,
        'ed_artist'      => $edArtist,
        'op_artist'      => $opArtist,
        'op_song'        => $opSong,
        'ed_song'        => $edSong,
        'other_artist'   => $otherArtist,
        'other_song'     => $otherSong,
        'sort'           => $articleId,       // Optional: same as article_id
        'type'           => $type,
        'article_id_course'=> $articleId. '-' .$course,
        'updated_at'     => current_time('mysql'),
        'created_at'     => current_time('mysql'),
    ];

    $formats = ['%s', '%d', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s'];

    $result = $wpdb->replace($table, $data, $formats);

    if ($result === false) {
        error_log("Error replacing music: " . $wpdb->last_error);
    }

    return $result;
}
