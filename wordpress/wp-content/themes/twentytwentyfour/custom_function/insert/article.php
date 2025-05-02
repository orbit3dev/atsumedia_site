<?php

if (!defined('ABSPATH')) {
    require_once('../../../../../wp-load.php'); // Adjust the path if needed
}

function insertOrUpdateArticle($wpdb, $data)
{
    // global $wpdb;

    $table_name = $wpdb->prefix . 'article';
    // Ensure JSON encoding of relevant fields
    $data['content'] = stripslashes(json_encode($data['content'], JSON_UNESCAPED_UNICODE));
    $data['summary'] = stripslashes(json_encode($data['summary'], JSON_UNESCAPED_UNICODE));
    $data['thumbnail'] = stripslashes(json_encode($data['thumbnail'], JSON_UNESCAPED_UNICODE));
    $data['video_url'] = stripslashes(json_encode($data['video_url'], JSON_UNESCAPED_UNICODE));

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
        'summary_title' => $data['summary_title'] ?? "",
        'summary_text' => $data['summary_text'] ?? "",
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
        'flag_series' =>  $data['flag_series'] ?? '',
        'canonical' =>  $data['canonical'] ?? '',
        'broadcast_day' =>  $data['broadcast_day'] ?? '',
        'weekday' =>  $data['weekday'] ?? '',
        'stream_day' =>  $data['stream_day'] ?? '',
        'kana' =>  $data['kana'] ?? '',
        'original_title' =>  $data['original_title'] ?? '',
        'primary_program' =>  $data['primary_program'] ?? '',
        'distribution' =>  $data['distribution'] ?? '',
        'production_country' =>  $data['production_country'] ?? '',
        'production_year' =>  $data['production_year'] ?? '',
        'dubcast' =>  $data['dubcast'] ?? '',
        'dubcast_role' =>  $data['dubcast_role'] ?? '',
        'executive_producer' =>  $data['executive_producer'] ?? '',
        'video_text' =>  $data['video_text'] ?? '',
        'title' =>  $data['title'] ?? '',
        'sns' =>  $data['sns'] ?? '',
        'label' =>  $data['label'] ?? '',
        'roadshow_day' =>  $data['roadshow_day'] ?? '',
    ];

    $formats = array_fill(0, count($insert_data), '%s');

    $result = $wpdb->replace($table_name, $insert_data, $formats);

    if ($result === false) {
        error_log("Error inserting or updating article: " . $wpdb->last_error);
    }
}
