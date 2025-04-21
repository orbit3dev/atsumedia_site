<?php
if (!defined('ABSPATH')) {
    require_once('../../../../../wp-load.php'); // Adjust path if needed
}

global $wpdb;

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['vod_ids'])) {
    // Sanitize input
    $raw_ids = sanitize_text_field($_POST['vod_ids']);
    $ids = array_filter(array_map('intval', explode(',', $raw_ids)));

    if (empty($ids)) {
        echo json_encode([]);
        exit;
    }

    // Prepare query
    $placeholders = implode(',', array_fill(0, count($ids), '%d'));
    $query = "SELECT id, name, microcopy FROM at_vod WHERE id IN ($placeholders)";
    $prepared = $wpdb->prepare($query, $ids);
    $results = $wpdb->get_results($prepared, ARRAY_A);

    // Reorder according to incoming VOD ID order
    $vod_map = [];
    foreach ($results as $row) {
        $vod_map[$row['id']] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'microcopy' => $row['microcopy']
        ];
    }

    // Match the original order from the input
    $ordered_response = [];
    foreach ($ids as $id) {
        if (isset($vod_map[$id])) {
            $ordered_response[] = $vod_map[$id];
        }
    }

    echo json_encode($ordered_response);
    exit;
}

echo json_encode([]);
exit;
