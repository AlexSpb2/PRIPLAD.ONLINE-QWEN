<?php
/**
 * Add format - добавление нового формата
 */

require_once __DIR__ . '/helpers.php';

requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = getJsonInput();

if (empty($data['name']) || empty($data['icon'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Name and icon required']);
    exit;
}

// Получаем максимальный sort_order
$stmt = $pdo->query("SELECT MAX(sort_order) as max_order FROM formats");
$result = $stmt->fetch();
$sortOrder = ($result['max_order'] ?? 0) + 1;

// Вставляем формат
$stmt = $pdo->prepare("
    INSERT INTO formats (name, icon, description, price, duration, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
");

$stmt->execute([
    $data['name'],
    $data['icon'],
    $data['description'] ?? '',
    $data['price'] ?? '',
    $data['duration'] ?? '',
    $sortOrder
]);

$id = $pdo->lastInsertId();

echo json_encode([
    'success' => true,
    'id' => (string)$id
]);
