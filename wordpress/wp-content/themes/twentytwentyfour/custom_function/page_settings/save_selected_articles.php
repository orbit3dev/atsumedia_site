<?php
if (!defined('ABSPATH')) {
    require_once('../../../../../wp-load.php'); // Adjust path if needed
}

global $wpdb;

header('Content-Type: application/json');

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Method not allowed', 405);
    }

    $articles = $_POST['articles'] ?? [];

    if (!is_array($articles) || empty($articles)) {
        throw new Exception('No articles received', 400);
    }

    // Constants
    $table_name = $wpdb->prefix . 'page_setting';
    $article_table = $wpdb->prefix . 'article';
    $type = 'CAROUSEL';
    $genre = 'anime';

    // Step 1: Delete existing CAROUSEL rows
    $wpdb->delete($table_name, ['type' => $type]);

    // Step 2: Get smallest available IDs
    $existing_ids = $wpdb->get_col("SELECT id FROM {$table_name} ORDER BY id ASC");
    $next_ids = [];
    $next_id = 1;

    foreach ($articles as $index => $article_id) {
        while (in_array($next_id, $existing_ids) || in_array($next_id, $next_ids)) {
            $next_id++;
        }
        $next_ids[] = $next_id;
    }

    // Step 3: Fetch program titles
    $placeholders = implode(',', array_fill(0, count($articles), '%d'));
    $query = "SELECT id, program_title FROM {$article_table} WHERE id IN ($placeholders)";
    $prepared = $wpdb->prepare($query, $articles);
    $programs = $wpdb->get_results($prepared, OBJECT_K); // object keyed by id

    // Step 4: Insert new rows
    $inserted_count = 0;
    foreach ($articles as $index => $article_id) {
        $program_title = $programs[$article_id]->program_title ?? 'タイトル未取得';
        $success = $wpdb->insert($table_name, [
            'id'          => $next_ids[$index],
            'article_id'  => $article_id,
            'genre'       => $genre,
            'type'        => $type,
            'sort'        => $index + 1,
            'notes'       => $program_title,
            'created_at'  => current_time('mysql'),
            'updated_at'  => current_time('mysql'),
        ]);

        if ($success === false) {
            throw new Exception('Insert failed at index ' . $index . ' (Article ID: ' . $article_id . ')');
        }

        $inserted_count++;
    }

    echo json_encode([
        'status' => 'success',
        'inserted_count' => $inserted_count,
        'ids_assigned' => $next_ids,
    ]);
} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
