<?php
/**
 * Общие функции API
 */

require_once __DIR__ . '/config.php';

function jsonResponse(array $data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function requireAuth(): void {
    if (empty($_SESSION['authenticated'])) {
        jsonResponse(['error' => 'Unauthorized'], 401);
    }

    $lastActivity = $_SESSION['last_activity'] ?? 0;
    if ($lastActivity && (time() - $lastActivity) > SESSION_LIFETIME) {
        $_SESSION = [];
        session_destroy();
        jsonResponse(['error' => 'Session expired'], 401);
    }

    $_SESSION['last_activity'] = time();
}

function getJsonInput(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '{}', true);
    return is_array($data) ? $data : [];
}

function isAllowedHost(string $host, array $domains): bool {
    $host = strtolower(preg_replace('/^www\./', '', $host));
    foreach ($domains as $domain) {
        $domain = strtolower(preg_replace('/^www\./', '', $domain));
        if ($host === $domain || str_ends_with($host, '.' . $domain)) {
            return true;
        }
    }
    return false;
}

function extractIframeSrc(string $value): ?string {
    if (!preg_match('/<iframe\b[^>]*\bsrc\s*=\s*["\']([^"\']+)["\'][^>]*>/i', $value, $match)) {
        return null;
    }
    return html_entity_decode(trim($match[1]), ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

function normalizeVideoUrl(string $value): string {
    $value = trim($value);
    $iframeSrc = extractIframeSrc($value);
    return $iframeSrc ?: $value;
}

function validateVideoUrl(string $url): bool {
    $url = normalizeVideoUrl($url);
    if ($url === '') return false;

    // Разрешаем iframe/embed-коды только с корректным src.
    if (str_contains($url, '<iframe') || str_contains($url, '>')) {
        return false;
    }

    if (preg_match('/^https?:\/\//i', $url)) {
        $parts = parse_url($url);
        if (!$parts || empty($parts['host'])) return false;

        $allowedDomains = [
            'youtube.com', 'youtu.be',
            'vimeo.com',
            'rutube.ru',
            'vk.com', 'vkvideo.ru'
        ];

        if (isAllowedHost($parts['host'], $allowedDomains)) {
            return true;
        }

        // VK video_ext.php — рабочий embed пользователя, не преобразуем его.
        if (basename($parts['path'] ?? '') === 'video_ext.php' && isAllowedHost($parts['host'], ['vk.com', 'vkvideo.ru'])) {
            return true;
        }

        // Прямые видеофайлы.
        return (bool)preg_match('/\.(mp4|webm|mov|m4v|ogv)(?:\?.*)?$/i', $parts['path'] ?? '');
    }

    return false;
}

function getVideoThumbnail(string $url): ?string {
    $url = normalizeVideoUrl($url);

    if (preg_match('/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?\/]+)/i', $url, $match)) {
        return 'https://img.youtube.com/vi/' . $match[1] . '/hqdefault.jpg';
    }

    return null;
}
