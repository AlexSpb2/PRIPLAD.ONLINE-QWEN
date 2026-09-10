<?php
/**
 * Update video - обновление видео
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

// Строим запрос на обновление
$updates = [];
$params = [];

if (isset($data['title'])) {
    $updates[] = "title = ?";
    $params[] = $data['title'];
}

if (isset($data['description'])) {
    $updates[] = "description = ?";
    $params[] = $data['description'];
}

if (isset($data['videoUrl'])) {
    if (!validateVideoUrl($data['videoUrl'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid video URL']);
        exit;
    }
    $updates[] = "video_url = ?";
    $params[] = $data['videoUrl'];
    
    // Обновляем thumbnail если он не указан явно
    if (!isset($data['poster']) || empty($data['poster'])) {
        $thumbnail = getVideoThumbnail($data['videoUrl']) ?? '';
        $updates[] = "thumbnail = ?";
        $params[] = $thumbnail;
    }
}

if (isset($data['poster'])) {
    $updates[] = "thumbnail = ?";
    $params[] = $data['poster'];
}

if (isset($data['formatId'])) {
    // Проверяем существование формата
    $stmt = $pdo->prepare("SELECT id FROM formats WHERE id = ?");
    $stmt->execute([$data['formatId']]);
    if (!$stmt->fetch()) {
        http_response_code(400);
        echo json_encode(['error' => 'Format not found']);
        exit;
    }
    $updates[] = "format_id = ?";
    $params[] = $data['formatId'];
}

if (isset($data['duration'])) {
    $updates[] = "duration = ?";
    $params[] = $data['duration'];
}

if (isset($data['sortOrder'])) {
    $updates[] = "sort_order = ?";
    $params[] = (int)$data['sortOrder'];
}

if (isset($data['published'])) {
    $updates[] = "published = ?";
    $params[] = $data['published'] ? 1 : 0;
}

if (empty($updates)) {
    http_response_code(400);
    echo json_encode(['error' => 'No fields to update']);
    exit;
}

$params[] = $data['id'];

$stmt = $pdo->prepare("UPDATE videos SET " . implode(', ', $updates) . " WHERE id = ?");
$stmt->execute($params);

echo json_encode([
    'success' => true,
    'message' => 'Video updated'
]);
