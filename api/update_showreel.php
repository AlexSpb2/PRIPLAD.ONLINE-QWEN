<?php
/**
 * Update showreel - обновление шоурила
 */

require_once __DIR__ . '/helpers.php';

requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = getJsonInput();
$videoUrl = normalizeVideoUrl((string)($data['videoUrl'] ?? ''));

if (empty($data['title']) || !$videoUrl || !validateVideoUrl($videoUrl)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid title and video URL are required']);
    exit;
}

$stmt = $pdo->query("SELECT id FROM showreel WHERE id = 1");
$exists = $stmt->fetch();

if ($exists) {
    $stmt = $pdo->prepare("UPDATE showreel SET title = ?, description = ?, video_url = ?, poster = ? WHERE id = 1");
    $stmt->execute([
        $data['title'],
        $data['description'] ?? '',
        $videoUrl,
        $data['poster'] ?? ''
    ]);
} else {
    $stmt = $pdo->prepare("INSERT INTO showreel (id, title, description, video_url, poster) VALUES (1, ?, ?, ?, ?)");
    $stmt->execute([
        $data['title'],
        $data['description'] ?? '',
        $videoUrl,
        $data['poster'] ?? ''
    ]);
}

echo json_encode(['success' => true, 'message' => 'Showreel updated']);
