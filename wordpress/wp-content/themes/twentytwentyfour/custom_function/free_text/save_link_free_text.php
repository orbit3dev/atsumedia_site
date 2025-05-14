<?php
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$url = $_GET['url'] ?? '';

if (!preg_match('#^https?://#', $url)) {
    $url = 'https://' . $url;
}
if (!filter_var($url, FILTER_VALIDATE_URL)) {
    echo json_encode(['success' => 0, 'error' => 'Invalid URLs']);
    exit;
}

try {
    $html = @file_get_contents($url);
    if (!$html) {
        throw new Exception('Unable to fetch content from URL');
    }

    $doc = new DOMDocument();
    libxml_use_internal_errors(true);
    if (!$doc->loadHTML($html)) {
        throw new Exception('Invalid HTML structure');
    }
    libxml_clear_errors();

    $xpath = new DOMXPath($doc);
    $meta = [];

    foreach (['title', 'description', 'image'] as $property) {
        $node = $xpath->query("//meta[@property='og:$property']")->item(0);
        if ($node instanceof DOMElement) {
            $meta[$property] = $node->getAttribute('content');
        }
    }

    echo json_encode([
        'success' => 1,
        'meta' => [
            'title' => $meta['title'] ?? '',
            'description' => $meta['description'] ?? '',
            'image' => ['url' => $meta['image'] ?? '']
        ]
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => 0, 'error' => $e->getMessage()]);
}
