<?php
if (!defined('ABSPATH')) {
    require_once('../../../../../wp-load.php');
}

global $wpdb;
$table = 'at_article_cast';

$castOrder = isset($_POST['cast_order']) ? json_decode(stripslashes($_POST['cast_order']), true) : [];
error_log(json_encode($castOrder));

if (empty($castOrder)) {
    echo json_encode(['success' => false, 'message' => 'データが空です']);
    exit;
}

$articleId = $castOrder[0]['article_id']; // All rows should have same article_id

// Fetch existing casts for this article
$existing = $wpdb->get_results(
    $wpdb->prepare("SELECT person_id FROM $table WHERE article_id = %d", $articleId),
    ARRAY_A
);
$existingPersonIds = array_column($existing, 'person_id');

// Loop through and update or insert
foreach ($castOrder as $cast) {
    $personId = intval($cast['person_id']);
    $roleName = sanitize_text_field($cast['role_name']);
    $sort = intval($cast['sort']);

    if (in_array($personId, $existingPersonIds)) {
        // Update
        error_log($sort);
        error_log($roleName);
        error_log($articleId);
        error_log($personId);
        error_log('-------------------');
        $wpdb->update(
            $table,
            [ 'sort' => $sort, 'role_name' => $roleName ],
            [ 'article_id' => $articleId, 'person_id' => $personId ]
        );
    } else {
        // Insert
        $wpdb->insert(
            $table,
            [
                'article_id' => $articleId,
                'person_id' => $personId,
                'role_name' => $roleName,
                'sort' => $sort
            ]
        );
    }
}

echo json_encode(['success' => true, 'message' => 'キャスト順を保存しました']);
