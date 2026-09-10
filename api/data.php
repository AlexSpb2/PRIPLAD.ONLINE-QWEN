<?php
/** Data - получение данных для сайта и админки */
require_once __DIR__ . '/helpers.php';

$stmt = $pdo->query("SELECT * FROM formats ORDER BY sort_order ASC, id ASC");
$formats = $stmt->fetchAll();

$isAdmin = !empty($_SESSION['authenticated']);
$videoSql = $isAdmin
    ? "SELECT * FROM videos ORDER BY format_id ASC, sort_order ASC, id ASC"
    : "SELECT * FROM videos WHERE published = 1 ORDER BY format_id ASC, sort_order ASC, id ASC";
$stmt = $pdo->query($videoSql);
$videos = $stmt->fetchAll();

$stmt = $pdo->query("SELECT * FROM showreel WHERE id = 1");
$showreel = $stmt->fetch();
if (!$showreel) {
    $showreel = [
        'title' => 'ШОУРИЛ\'26',
        'description' => 'Подборка работ за 2026 год',
        'video_url' => '',
        'poster' => ''
    ];
}

$formattedFormats = array_map(function($f) {
    return [
        'id' => (string)$f['id'], 'name' => $f['name'], 'icon' => $f['icon'],
        'description' => $f['description'], 'price' => $f['price'],
        'duration' => $f['duration'], 'sortOrder' => (int)$f['sort_order']
    ];
}, $formats);

$formattedVideos = array_map(function($v) {
    return [
        'id' => (string)$v['id'], 'title' => $v['title'], 'description' => $v['description'],
        'videoUrl' => $v['video_url'], 'poster' => $v['thumbnail'],
        'duration' => $v['duration'], 'formatId' => (string)$v['format_id'],
        'sortOrder' => (int)$v['sort_order'], 'published' => (bool)$v['published']
    ];
}, $videos);

$formattedShowreel = [
    'title' => $showreel['title'], 'description' => $showreel['description'],
    'videoUrl' => $showreel['video_url'], 'poster' => $showreel['poster']
];

echo json_encode([
    'formats' => $formattedFormats,
    'videos' => $formattedVideos,
    'showreel' => $formattedShowreel
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
