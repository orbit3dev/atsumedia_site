<?php
// File: /your-plugin-or-custom-page/api/editorjs_upload_image.php

if (!defined('ABSPATH')) {
    require_once('../../../../../wp-load.php');
}

header('Content-Type: application/json');

try {
    global $wpdb;

    if (!isset($_FILES['image'])) {
        throw new Exception('No file uploaded');
    }

    $file = $_FILES['image'];

    // Step 1: Get or generate news_id
    if (isset($_POST['news_id']) && intval($_POST['news_id']) > 0) {
        $news_id = intval($_POST['news_id']);
    } else {
        $latest_id = $wpdb->get_var("SELECT MAX(id) FROM at_news");
        $news_id = $latest_id ? intval($latest_id) + 1 : 1;
    }

    // Step 2: Validate image type
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($file['type'], $allowed_types)) {
        throw new Exception('Unsupported file type');
    }

    // Step 3: Set up directories
    $upload_dir = get_template_directory() . '/assets/assets/news/content/image/';
    $upload_uri = get_template_directory_uri() . '/assets/assets/news/content/image/';

    if (!file_exists($upload_dir)) {
        wp_mkdir_p($upload_dir);
    }

    // Step 4: Get next image number
    $existing_files = glob($upload_dir . "{$news_id}_news_*.{jpg,jpeg,png,webp,gif}", GLOB_BRACE);
    $pic_number = count($existing_files) + 1;

    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $safe_extension = strtolower($extension);
    $base_filename = "{$news_id}_news_{$pic_number}";
    $final_filename = $base_filename . '.' . $safe_extension;
    $target_path = $upload_dir . $final_filename;

    // Step 5: If file exists, soft-delete with _v1, _v2, etc.
    if (file_exists($target_path)) {
        $version = 1;
        do {
            $soft_deleted_name = "{$base_filename}_v{$version}." . $safe_extension;
            $soft_deleted_path = $upload_dir . $soft_deleted_name;
            $version++;
        } while (file_exists($soft_deleted_path));

        rename($target_path, $soft_deleted_path);
    }

    // Step 6: Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $target_path)) {
        throw new Exception('Failed to move uploaded file');
    }

    $url = $upload_uri . $final_filename;

    echo json_encode([
        'success' => 1,
        'file' => [
            'url' => $url
        ]
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => 0,
        'message' => $e->getMessage()
    ]);
}
