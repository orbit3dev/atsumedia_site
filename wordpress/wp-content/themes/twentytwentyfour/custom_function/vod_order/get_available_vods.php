<?php
if (!defined('ABSPATH')) {
    require_once('../../../../../wp-load.php'); // Adjust path if needed
}
global $wpdb;

$exclude_ids = isset($_POST['exclude_ids']) ? explode(',', $_POST['exclude_ids']) : [];
$placeholders = implode(',', array_fill(0, count($exclude_ids), '%d'));

$sql = "SELECT id, name, microcopy FROM at_vod";
if (!empty($exclude_ids)) {
    $sql .= " WHERE id NOT IN ($placeholders)";
}

$query = $wpdb->prepare($sql, $exclude_ids);
$results = $wpdb->get_results($query);

echo json_encode($results);
exit;
