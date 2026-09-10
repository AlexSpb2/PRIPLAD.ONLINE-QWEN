<?php
/**
 * Login - авторизация администратора
 */

require_once __DIR__ . '/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = getJsonInput();
$password = $data['password'] ?? '';

if (empty($password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Password required']);
    exit;
}

// Проверяем пароль
if (password_verify($password, ADMIN_PASSWORD_HASH)) {
    // Успешная авторизация
    $_SESSION['authenticated'] = true;
    $_SESSION['last_activity'] = time();
    
    echo json_encode([
        'success' => true,
        'message' => 'Login successful'
    ]);
} else {
    // Неверный пароль
    http_response_code(401);
    echo json_encode(['error' => 'Invalid password']);
}
