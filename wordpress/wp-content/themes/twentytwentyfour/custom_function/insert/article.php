<?php

if (!defined('ABSPATH')) {
    require_once('../../../../../wp-load.php'); // Adjust the path if needed
}

function insertOrUpdateArticle($wpdb, $data) {
    // global $wpdb;

    $table_name = $wpdb->prefix . 'article';
    // Ensure JSON encoding of relevant fields
    $data['content'] = json_encode($data['content'],JSON_UNESCAPED_UNICODE);
    $data['summary'] = json_encode($data['summary'],JSON_UNESCAPED_UNICODE);
    $data['thumbnail'] = json_encode($data['thumbnail'],JSON_UNESCAPED_UNICODE);
    $data['video_url'] = json_encode($data['video_url'],JSON_UNESCAPED_UNICODE);

    $insert_data = [
        'id' => $data['id'],
        'author_organization' => $data['author_organization'],
        'category_id' => $data['category_id'],
        'content' => $data['content'],
        'copyright' => $data['copyright'],
        'created_at' => $data['created_at'],
        'description_meta' => $data['description_meta'],
        'distributor' => $data['distributor'],
        'distributor_overseas' => $data['distributor_overseas'],
        'duration_time' => $data['duration_time'],
        'duration_period' => $data['duration_period'],
        'staff' => $data['staff'],
        'summary' => $data['summary'],
        'tag' => $data['tag'],
        'thumbnail' => $data['thumbnail'],
        'program_title' => $data['program_title'],
        'title_meta' => $data['title_meta'],
        'updated_at' => $data['updated_at'],
        'video_url' => $data['video_url'],
        'volume' => $data['volume'],
        'website' => $data['website'],
        'path' => $data['path'],
        'path_name' => $data['path_name'],
        'genre_type_id' => $data['genre_type_id'],
        'tag_type_id' => $data['tag_type_id'],
        'vod' => $data['vod'],
        'parent_id' => $data['parent_id'],
        'network_id' => $data['network_id'],
        'season_id' => $data['season_id'],
        'thumbnail_url' => $data['thumbnail_url'],
        'sort' => (int)$data['sort'],
    ];

    $formats = array_fill(0, count($insert_data), '%s');

    $result = $wpdb->replace($table_name, $insert_data, $formats);

    if ($result === false) {
        error_log("Error inserting or updating article: " . $wpdb->last_error);
    }
}
