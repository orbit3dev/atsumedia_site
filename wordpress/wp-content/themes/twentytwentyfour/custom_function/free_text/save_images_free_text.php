<?php
// File: /your-plugin-or-custom-page/api/editorjs_upload_image.php

if (!defined('ABSPATH')) {
    require_once('../../../../../wp-load.php');
}

header('Content-Type: application/json');

try {
    if (!isset($_FILES['image'])) {
        throw new Exception('No file uploaded');
    }

    if (!isset($_POST['article_id'])) {
        throw new Exception('Missing article_id');
    }

    $file = $_FILES['image'];
    $article_id = intval($_POST['article_id']);

    // Validate image type
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($file['type'], $allowed_types)) {
        throw new Exception('Unsupported file type');
    }

    // Get upload target path
    $upload_dir = get_template_directory() . '/assets/assets/news/content/image/';
    $upload_uri = get_template_directory_uri() . '/assets/assets/news/content/image/';

    // Create folder if needed
    if (!file_exists($upload_dir)) {
        wp_mkdir_p($upload_dir);
    }

    // Generate a unique image number (based on existing files)
    $existing_files = glob($upload_dir . "{$article_id}_article_*.{jpg,jpeg,png,webp,gif}", GLOB_BRACE);
    $pic_number = count($existing_files) + 1;

    // Get extension
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $safe_extension = strtolower($extension);

    $filename = "{$article_id}_article_{$pic_number}." . $safe_extension;
    $target_path = $upload_dir . $filename;

    if (!move_uploaded_file($file['tmp_name'], $target_path)) {
        throw new Exception('Failed to move uploaded file');
    }

    $url = $upload_uri . $filename;

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
