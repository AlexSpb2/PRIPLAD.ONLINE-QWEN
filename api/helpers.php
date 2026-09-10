<?php
/**
 * Вспомогательные функции API
 */

/**
 * Проверка авторизации
 */
function requireAuth() {
    if (empty($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
    
    // Проверка времени сессии
    if (isset($_SESSION['last_activity'])) {
        $elapsed = time() - $_SESSION['last_activity'];
        if ($elapsed > SESSION_LIFETIME) {
            session_destroy();
            http_response_code(401);
            echo json_encode(['error' => 'Session expired']);
            exit;
        }
    }
    
    // Обновляем время последней активности
    $_SESSION['last_activity'] = time();
}

/**
 * Получить JSON данные из запроса
 */
function getJsonInput() {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
        exit;
    }
    
    return $data;
}

/**
 * Валидация URL видео
 */
function validateVideoUrl($url) {
    if (empty($url)) {
        return false;
    }
    
    // Разрешённые домены
    $allowedDomains = [
        'youtube.com',
        'youtu.be',
        'vimeo.com',
        'rutube.ru',
        'vk.com',
        'vkvideo.ru',
    ];
    
    // Проверяем, является ли URL прямым видеофайлом
    if (preg_match('/\.(mp4|webm|mov|m4v|ogv)(\?|$)/i', $url)) {
        return true;
    }
    
    // Проверяем домен
    $host = parse_url($url, PHP_URL_HOST);
    if ($host && in_array(strtolower($host), $allowedDomains)) {
        return true;
    }
    
    // Разрешаем video_ext.php для VK
    if (strpos($url, 'video_ext.php') !== false) {
        return true;
    }
    
    return false;
}

/**
 * Получить thumbnail для видео
 */
function getVideoThumbnail($url) {
    // YouTube
    if (preg_match('/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?\n]+)/', $url, $matches)) {
        return "https://img.youtube.com/vi/{$matches[1]}/maxresdefault.jpg";
    }
    
    // Vimeo
    if (preg_match('/vimeo\.com\/(\d+)/', $url, $matches)) {
        // Для Vimeo нужно делать API запрос, возвращаем заглушку
        return null;
    }
    
    // RuTube
    if (preg_match('/rutube\.ru\/video\/([^\/\?]+)/', $url, $matches)) {
        return null; // Нужен API запрос
    }
    
    // VK
    if (preg_match('/vk\.com\/video.*?oid=(-?\d+).*?id=(\d+)/', $url, $matches)) {
        return null; // Нужен API запрос
    }
    
    return null;
}
