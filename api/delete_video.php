<?php
/**
 * Delete video - удаление видео
 */

require_once __DIR__ . '/helpers.php';

requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = getJsonInput();

if (empty($data['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Video ID required']);
    exit;
}

// Проверяем существование видео
$stmt = $pdo->prepare("SELECT id FROM videos WHERE id = ?");
$stmt->execute([$data['id']]);
if (!$stmt->fetch()) {
    http_response_code(404);
    echo json_encode(['error' => 'Video not found']);
    exit;
}

// Удаляем видео
$stmt = $pdo->prepare("DELETE FROM videos WHERE id = ?");
$stmt->execute([$data['id']]);

echo json_encode([
    'success' => true,
    'message' => 'Video deleted'
]);
