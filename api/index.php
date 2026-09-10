<?php
/**
 * Основной роутер API
 */

// Загружаем конфигурацию
if (!file_exists(__DIR__ . '/config.php')) {
    http_response_code(500);
    echo json_encode(['error' => 'Configuration not found']);
    exit;
}

require_once __DIR__ . '/config.php';

// CORS заголовки
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, ALLOWED_ORIGINS)) {
    header("Access-Control-Allow-Origin: $origin");
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

// Обработка preflight запросов
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Подключаем базу данных
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// Запускаем сессию
session_start();

// Получаем action из URL
$action = $_GET['action'] ?? '';

// Роутинг
try {
    switch ($action) {
        case 'ping':
            require_once __DIR__ . '/ping.php';
            break;
        
        case 'login':
            require_once __DIR__ . '/login.php';
            break;
        
        case 'logout':
            require_once __DIR__ . '/logout.php';
            break;
        
        case 'check_auth':
            require_once __DIR__ . '/check_auth.php';
            break;
        
        case 'data':
            require_once __DIR__ . '/data.php';
            break;
        
        case 'add_video':
            require_once __DIR__ . '/add_video.php';
            break;
        
        case 'update_video':
            require_once __DIR__ . '/update_video.php';
            break;
        
        case 'delete_video':
            require_once __DIR__ . '/delete_video.php';
            break;
        
        case 'reorder_videos':
            require_once __DIR__ . '/reorder_videos.php';
            break;
        
        case 'add_format':
            require_once __DIR__ . '/add_format.php';
            break;
        
        case 'update_format':
            require_once __DIR__ . '/update_format.php';
            break;
        
        case 'delete_format':
            require_once __DIR__ . '/delete_format.php';
            break;
        
        case 'update_showreel':
            require_once __DIR__ . '/update_showreel.php';
            break;
        
        case 'video_preview':
            require_once __DIR__ . '/video_preview.php';
            break;
        
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Action not found']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
