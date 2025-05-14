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

    // Clean and validate original URL
    $original_url = trim(esc_url_raw($_POST['original_url']));
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

    $site_path = parse_url($site_url, PHP_URL_PATH);
    $relative_path = preg_replace("#^" . preg_quote(ltrim($site_path, '/')) . "#", '', $relative_path);
    $absolute_path = ABSPATH . $relative_path;
    $absolute_path = str_replace('\\', '/', $absolute_path);

    $ext = pathinfo($absolute_path, PATHINFO_EXTENSION);
    $basename = pathinfo($absolute_path, PATHINFO_FILENAME);
    $dir = dirname($absolute_path);

    $backup_done = false;

    // If file exists, backup first
    if (file_exists($absolute_path)) {
        $version = 1;
        do {
            $versioned_path = "$dir/{$basename}_v{$version}.{$ext}";
            $version++;
        } while (file_exists($versioned_path));

        if (!rename($absolute_path, $versioned_path)) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to back up the original image.'
            ]);
            exit;
        }

        $backup_done = true;
    }

    // Create directory if it doesn't exist
    if (!is_dir($dir)) {
        if (!mkdir($dir, 0755, true)) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to create directory for image upload.'
            ]);
            exit;
        }
    }

    // Move uploaded file
    $tmp_name = $_FILES['new_image']['tmp_name'];
    if (!is_uploaded_file($tmp_name) || !move_uploaded_file($tmp_name, $absolute_path)) {
        // Restore backup if move fails
        if ($backup_done && isset($versioned_path) && file_exists($versioned_path)) {
            rename($versioned_path, $absolute_path);
        }

        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to upload new image.'
        ]);
        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => $backup_done ? 'Original image replaced successfully.' : 'Image uploaded successfully.',
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
