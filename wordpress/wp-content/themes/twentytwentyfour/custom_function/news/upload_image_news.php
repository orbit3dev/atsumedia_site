<?php
// upload_image_news.php

if (!defined('ABSPATH')) {
    require_once('../../../../../wp-load.php'); // Adjust path to wp-load.php as needed
}

if (!function_exists('wp_handle_upload')) {
    require_once ABSPATH . 'wp-admin/includes/file.php';
}

if (!current_user_can('upload_files')) {
    wp_send_json_error(['message' => 'Unauthorized']);
}

if (!isset($_FILES['file'])) {
    wp_send_json_error(['message' => 'No file uploaded']);
}

$file = $_FILES['file'];
$theme_dir  = get_template_directory();
$theme_uri  = get_template_directory_uri();
$subfolder  = '/assets/assets/news/content/image/';
$upload_dir = $theme_dir . $subfolder;
$upload_url = $theme_uri . $subfolder;

if (!file_exists($upload_dir)) {
    wp_mkdir_p($upload_dir);
}

$filename = sanitize_file_name($file['name']);
$filepath = $upload_dir . $filename;
$i = 1;
$path_parts = pathinfo($filename);
while (file_exists($filepath)) {
    $filename = $path_parts['filename'] . '-' . $i . '.' . $path_parts['extension'];
    $filepath = $upload_dir . $filename;
    $i++;
}

if (move_uploaded_file($file['tmp_name'], $filepath)) {
    wp_send_json_success(['url' => $upload_url . $filename]);
} else {
    wp_send_json_error(['message' => 'File move failed']);
}
