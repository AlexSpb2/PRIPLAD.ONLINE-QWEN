<?php
/**
 * Reorder videos - изменение порядка видео
 */

require_once __DIR__ . '/helpers.php';

requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = getJsonInput();

if (empty($data['formatId']) || empty($data['videoIds']) || !is_array($data['videoIds'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Format ID and video IDs array required']);
    exit;
}

// Начинаем транзакцию
$pdo->beginTransaction();

try {
    foreach ($data['videoIds'] as $index => $videoId) {
        $sortOrder = $index + 1;
        $stmt = $pdo->prepare("UPDATE videos SET sort_order = ? WHERE id = ? AND format_id = ?");
        $stmt->execute([$sortOrder, $videoId, $data['formatId']]);
    }
    
    $pdo->commit();
    
    echo json_encode([
        'success' => true,
        'message' => 'Videos reordered'
    ]);
} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Failed to reorder videos']);
}
