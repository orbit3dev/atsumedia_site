<?php

require_once "db/db.php";
require_once "constants/constants.php";

function insertMusic( $articleId, $course, $edArtist, $opArtist, $opSong, $otherArtist, $otherSong, $type, $updatedAt, $createdAt)
{
    global $conn;

    $stmt = $conn->prepare("
        INSERT INTO " .TABLE_MUSIC . " (article_id, course, ed_artist, op_artist, op_song 
        ,other_artist, other_song, sort, type, updated_at, created_at)
        VALUES (?, ?, ?, ?, ?, ? , ? ,? ,?, ? ,?)
        ON DUPLICATE KEY UPDATE
            article_id = VALUES(article_id),
            type = VALUES(type),
            sort = VALUES(sort),
            created_at = VALUES(created_at),
            updated_at = VALUES(updated_at)
    ");

    $stmt->bind_param("sisssssisss", $articleId, $course, $edArtist, $opArtist, $opSong, $otherArtist, $otherSong,$articleId, $type, $updatedAt, $createdAt);
    $stmt->execute();
}
