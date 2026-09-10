<?php
/**
 * Delete format - удаление формата с каскадным удалением видео
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
    echo json_encode(['error' => 'Format ID required']);
    exit;
}

// Проверяем существование формата
$stmt = $pdo->prepare("SELECT id FROM formats WHERE id = ?");
$stmt->execute([$data['id']]);
if (!$stmt->fetch()) {
    http_response_code(404);
    echo json_encode(['error' => 'Format not found']);
    exit;
}

// Начинаем транзакцию
$pdo->beginTransaction();

try {
    // Удаляем все видео этого формата
    $stmt = $pdo->prepare("DELETE FROM videos WHERE format_id = ?");
    $stmt->execute([$data['id']]);
    
    // Удаляем формат
    $stmt = $pdo->prepare("DELETE FROM formats WHERE id = ?");
    $stmt->execute([$data['id']]);
    
    $pdo->commit();
    
    echo json_encode([
        'success' => true,
        'message' => 'Format and associated videos deleted'
    ]);
} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Failed to delete format']);
}
