<?php
/**
 * Video preview - получение превью для видео
 */

require_once __DIR__ . '/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = getJsonInput();

if (empty($data['url'])) {
    http_response_code(400);
    echo json_encode(['error' => 'URL required']);
    exit;
}

$thumbnail = getVideoThumbnail($data['url']);

echo json_encode([
    'thumbnail' => $thumbnail ?? '',
    'url' => $data['url']
]);
