<?php
if (!defined('ABSPATH')) {
    require_once('../../../../../wp-load.php'); // Adjust the path if needed
}

// Function to fetch content data
function fetch_content_data()
{
    global $wpdb;
    $current_user = wp_get_current_user();


    // Get pagination parameters from DataTables request
    $draw = isset($_POST['draw']) ? intval($_POST['draw']) : 1;
    $start = isset($_POST['start']) ? intval($_POST['start']) : 0;
    $length = isset($_POST['length']) ? intval($_POST['length']) : 10;

    // Get total records (before filtering)
    $totalRecords = $wpdb->get_var("SELECT COUNT(*) FROM at_news where id=" . $current_user->ID);
    // Query example (adjust based on your DB structure)
    $current_user = wp_get_current_user();
    $results = $wpdb->get_results(
        "SELECT at_news.*, 
        path_name AS slug, 
        description_meta AS synopsis
        FROM at_news where id_author_create = " .  $current_user->ID . "
        and is_deleted = 0
        ORDER BY created_at DESC         
        LIMIT $start, $length",
        ARRAY_A
    );

    foreach ($results as &$row) {
        // Convert `is_public` to 公開 / 非公開
        $row['is_public'] = ($row['is_public'] == 1) ? '公開' : '非公開';

        // Convert `is_top` to 表示 / 非表示
        $row['is_top'] = ($row['is_top'] == 1) ? '表示' : '非表示';

        // Convert `created_at` to Japanese format
        if (!empty($row['created_at'])) {
            $date = new DateTime($row['created_at']);
            $row['created_at'] = $date->format('Y年m月d日 H時i分');
        }
    }

    // Return data in DataTable format
    $response = [
        "draw" => $draw,
        "recordsTotal" => $totalRecords,
        "recordsFiltered" => $totalRecords, // No filtering yet, so same as total
        "data" => ($results)
    ];

    $response = [
        "draw" => $draw,
        "recordsTotal" => $totalRecords,
        "recordsFiltered" => $totalRecords, // No filtering yet, so same as total
        "data" => ($results)
    ];

    wp_send_json($response);
    exit;
}


function get_news_by_id()
{
    global $wpdb;
    $id = intval($_POST['id']);

    $result = $wpdb->get_row($wpdb->prepare(
        "SELECT 
        title, path_name AS slug, description_meta AS synopsis,
        is_public, is_top, id, created_at,
        title_meta, description_meta, content, outline,
        banner, related_titles, author, author_description, datetime AS date_news,
        image, author_image, genre_type
        FROM at_news WHERE id = %d",
        $id
    ), ARRAY_A);

    if ($result) {
        $result['is_public'] = $result['is_public'] ? "公開" : "非公開";
        $result['is_top'] = $result['is_top'] ? "表示" : "非表示";
        $result['location'] = site_url();
        $base_url = IMAGE_LOCATION_STORE;
        if (isset($result['image'])) {
            $result['image'] = $base_url . $result['image'];
        }
        if (isset($result['author_image'])) {
            $result['author_image'] = $base_url . $result['author_image'];
        }
        if (!empty($result['related_titles'])) {
            $ids = array_map('intval', explode(',', $result['related_titles']));
            $placeholders = implode(',', array_fill(0, count($ids), '%d'));
            $query = "
                SELECT id, path_name AS text, thumbnail_url AS image, vod
                FROM at_article
                WHERE id IN ($placeholders)
            ";

            $prepared_query = $wpdb->prepare($query, ...$ids);
            $related_rows = $wpdb->get_results($prepared_query, ARRAY_A);

            foreach ($related_rows as &$row) {
                $row['image'] = get_template_directory_uri() . '/assets/assets/' . $row['image'] . '?v=' . time();
            }

            $result['related_articles'] = !empty($related_rows) ? json_encode($related_rows) : null;
        } else {
            // $result['related_articles'] = 1;
        }
        error_log("Data news fetched successfully: " . print_r($result, true));
        echo json_encode(["success" => true, "data" => $result]);
    } else {
        error_log("No data found for ID: " . $id);
        echo json_encode(["success" => false, "message" => "データが見つかりません"]);
    }

    exit;
}

function change_status_activation()
{
    global $wpdb;

    $id = intval($_POST['id']);
    $status = ($_POST['status'] === '公開') ? 1 : 0; // Convert to TINYINT (1 or 0)
    $current_datetime = current_time('mysql'); // Get WordPress timezone-adjusted datetime
    // Update `is_public` and `updated_at`
    $result = $wpdb->update(
        'at_news',
        [
            'is_public' => $status,
            'updated_at' => $current_datetime
        ],
        ['id' => $id], // Where condition
        ['%d', '%s'], // Data formats: `is_public` (integer), `updated_at` (string)
        ['%d']  // Data format for `id`
    );

    if ($result !== false) { // Check if the update was successful
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => $wpdb->last_error]);
    }

    exit;
}

function delete_news_by_id() {
    global $wpdb;

    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;

    if ($id <= 0) {
        echo json_encode([
            'success' => false,
            'message' => '不正なIDです'
        ]);
        exit;
    }

    $table_name = $wpdb->prefix . 'news'; // ✅ Replace with your actual news table name

    $updated = $wpdb->update(
        $table_name,
        ['is_deleted' => 1],            // Soft delete
        ['id' => $id],
        ['%d'],
        ['%d']
    );

    if ($updated !== false) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => '削除処理に失敗しました'
        ]);
    }

    exit;
}




if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'fetch_content_data') {
        fetch_content_data();
    } elseif ($_POST['action'] === 'get_news_by_id') {
        get_news_by_id();
    } elseif ($_POST['action'] === 'change_status') {
        change_status_activation();
    } elseif ($_POST['action'] === 'delete_news_by_id') {
        delete_news_by_id(); // ← Add this line
    }
}
