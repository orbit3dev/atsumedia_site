<?php
if (!defined('ABSPATH')) {
    require_once('../../../../../wp-load.php'); // Adjust the path if needed
}

global $wpdb;

$article_id = $_POST['article_id'];
$content = stripslashes($_POST['content']);

try {
    // Check if the article already exists
    $existing_article = $wpdb->get_row($wpdb->prepare(
        "SELECT free_text_id FROM {$wpdb->prefix}article_free_text WHERE article_id = %d LIMIT 1",
        $article_id
    ));
    if ($existing_article) {
        // Update existing article
        $wpdb->update(
            "{$wpdb->prefix}article_free_text",
            array('content' => $content),
            array('article_id' => $article_id),
            array('%s'),
            array('%d')
        );
    } else {
        // Insert new article content
        $wpdb->insert(
            "{$wpdb->prefix}article_free_text",
            array(
                'article_id' => $article_id,
                'content' => $content
            ),
            array('%d', '%s')
        );
    }

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
