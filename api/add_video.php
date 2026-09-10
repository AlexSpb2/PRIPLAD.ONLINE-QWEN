<?php
/**
 * Add video - добавление нового видео
 */

require_once __DIR__ . '/helpers.php';

requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = getJsonInput();

if (empty($data['title']) || empty($data['videoUrl']) || empty($data['formatId'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$videoUrl = normalizeVideoUrl($data['videoUrl']);

if (!validateVideoUrl($videoUrl)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid video URL or iframe']);
    exit;
}

$stmt = $pdo->prepare("SELECT id FROM formats WHERE id = ?");
$stmt->execute([$data['formatId']]);
if (!$stmt->fetch()) {
    http_response_code(400);
    echo json_encode(['error' => 'Format not found']);
    exit;
}

$stmt = $pdo->prepare("SELECT MAX(sort_order) as max_order FROM videos WHERE format_id = ?");
$stmt->execute([$data['formatId']]);
$result = $stmt->fetch();
$sortOrder = ($result['max_order'] ?? 0) + 1;

$thumbnail = $data['poster'] ?? '';
if (empty($thumbnail)) {
    $thumbnail = getVideoThumbnail($videoUrl) ?? '';
}

$stmt = $pdo->prepare("
    INSERT INTO videos (title, description, format_id, video_url, thumbnail, duration, sort_order, published)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
");

$stmt->execute([
    $data['title'],
    $data['description'] ?? '',
    $data['formatId'],
    $videoUrl,
    $thumbnail,
    $data['duration'] ?? '',
    $sortOrder,
    !empty($data['published']) ? 1 : 0
]);

$id = $pdo->lastInsertId();

echo json_encode([
    'success' => true,
    'id' => (string)$id
]);
