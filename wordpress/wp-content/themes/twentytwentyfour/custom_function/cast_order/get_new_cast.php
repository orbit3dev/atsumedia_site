<?php
if (!defined('ABSPATH')) {
    require_once('../../../../../wp-load.php');
}

global $wpdb;

$excludeIds = isset($_POST['exclude_ids']) ? explode(',', $_POST['exclude_ids']) : [];
$search = isset($_POST['term']) ? sanitize_text_field($_POST['term']) : '';
$page = isset($_POST['page']) ? intval($_POST['page']) : 1;
$perPage = 10;
$offset = ($page - 1) * $perPage;

$where = "WHERE 1=1";

if (!empty($excludeIds)) {
    $placeholders = implode(',', array_fill(0, count($excludeIds), '%d'));
    $where .= " AND id NOT IN ($placeholders)";
}

if (!empty($search)) {
    $where .= " AND name LIKE %s";
    $searchTerm = '%' . $search . '%';
}

$query = "SELECT id, name FROM at_person $where ORDER BY sort ASC LIMIT %d OFFSET %d";

$params = $excludeIds;
if (!empty($search)) {
    $params[] = $searchTerm;
}
$params[] = $perPage;
$params[] = $offset;

$prepared_query = $wpdb->prepare($query, ...$params);
$results = $wpdb->get_results($prepared_query);

$response = array_map(function ($row) {
    return [
        'id' => $row->id,
        'text' => $row->name
    ];
}, $results);

// Send Select2 formatted JSON
echo json_encode([
    'results' => $response,
    'pagination' => ['more' => count($response) === $perPage]
]);
