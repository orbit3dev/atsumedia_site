<?php
if (!defined('ABSPATH')) {
    require_once('../../../../../wp-load.php'); // Adjust path to wp-load.php as needed
}

header('Content-Type: application/json');

try {
    if (!isset($_POST['original_url']) || !isset($_FILES['new_image'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Missing original image URL or uploaded image.'
        ]);
        exit;
    }

    // Trim the URL to remove any unnecessary spaces
    $original_url = trim(esc_url_raw($_POST['original_url']));
    $parsed_url_path = parse_url($original_url, PHP_URL_PATH);

    // Get relative file system path from the URL
    $site_url = site_url();
    if (strpos($original_url, $site_url) !== 0) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid image URL.'
        ]);
        exit;
    }

    $relative_path = ltrim(parse_url($original_url, PHP_URL_PATH), '/');
    $relative_path = preg_replace('#[\\\\/]+#', '/', $relative_path);
    $site_path = parse_url(site_url(), PHP_URL_PATH); // e.g. /atsumedia_site/atsumedia_site/wordpress
    $relative_path = preg_replace("#^" . preg_quote(ltrim($site_path, '/')) . "#", '', $relative_path);
    $absolute_path = ABSPATH . $relative_path;
    $absolute_path = str_replace('\\', '/', $absolute_path); // Normalize for Windows

    if (!file_exists($absolute_path)) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Original image not found on server.',
            'path' => $absolute_path
        ]);
        exit;
    }

    $ext = pathinfo($absolute_path, PATHINFO_EXTENSION);
    $basename = pathinfo($absolute_path, PATHINFO_FILENAME);
    $dir = dirname($absolute_path);

    // Versioning: soft delete original
    $version = 1;
    do {
        $versioned_path = "$dir/{$basename}_v{$version}.{$ext}";
        $version++;
    } while (file_exists($versioned_path));

    if (!rename($absolute_path, $versioned_path)) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to rename (soft-delete) original image.'
        ]);
        exit;
    }

    // Trim uploaded file name to avoid any unwanted spaces
    $new_image_path = trim($_FILES['new_image']['tmp_name']);

    if (!move_uploaded_file($new_image_path, $absolute_path)) {
        // Try to restore the original if move fails
        rename($versioned_path, $absolute_path);
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to replace image with new upload.'
        ]);
        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Image replaced successfully.',
        'new_url' => $original_url
    ]);
    exit;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
    exit;
}
