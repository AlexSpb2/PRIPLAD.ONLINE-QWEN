<?php
/**
 * Update format - обновление формата
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

// Строим запрос на обновление
$updates = [];
$params = [];

if (isset($data['name'])) {
    $updates[] = "name = ?";
    $params[] = $data['name'];
}

if (isset($data['icon'])) {
    $updates[] = "icon = ?";
    $params[] = $data['icon'];
}

if (isset($data['description'])) {
    $updates[] = "description = ?";
    $params[] = $data['description'];
}

if (isset($data['price'])) {
    $updates[] = "price = ?";
    $params[] = $data['price'];
}

if (isset($data['duration'])) {
    $updates[] = "duration = ?";
    $params[] = $data['duration'];
}

if (isset($data['sortOrder'])) {
    $updates[] = "sort_order = ?";
    $params[] = (int)$data['sortOrder'];
}

if (empty($updates)) {
    http_response_code(400);
    echo json_encode(['error' => 'No fields to update']);
    exit;
}

$params[] = $data['id'];

$stmt = $pdo->prepare("UPDATE formats SET " . implode(', ', $updates) . " WHERE id = ?");
$stmt->execute($params);

echo json_encode([
    'success' => true,
    'message' => 'Format updated'
]);
