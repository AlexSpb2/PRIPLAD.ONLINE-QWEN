<?php
/**
 * Data - получение всех данных (форматы, видео, шоурил)
 */

require_once __DIR__ . '/helpers.php';

// Получаем форматы
$stmt = $pdo->query("SELECT * FROM formats ORDER BY sort_order ASC");
$formats = $stmt->fetchAll();

// Получаем все видео
$stmt = $pdo->query("SELECT * FROM videos ORDER BY sort_order ASC");
$videos = $stmt->fetchAll();

// Получаем шоурил
$stmt = $pdo->query("SELECT * FROM showreel WHERE id = 1");
$showreel = $stmt->fetch();

// Если шоурила нет, создаём дефолтный
if (!$showreel) {
    $showreel = [
        'title' => 'ШОУРИЛ\'26',
        'description' => 'Подборка работ за 2026 год',
        'video_url' => '',
        'poster' => ''
    ];
}

// Форматируем данные
$formattedFormats = array_map(function($f) {
    return [
        'id' => (string)$f['id'],
        'name' => $f['name'],
        'icon' => $f['icon'],
        'description' => $f['description'],
        'price' => $f['price'],
        'duration' => $f['duration'],
        'sortOrder' => (int)$f['sort_order']
    ];
}, $formats);

$formattedVideos = array_map(function($v) {
    return [
        'id' => (string)$v['id'],
        'title' => $v['title'],
        'description' => $v['description'],
        'videoUrl' => $v['video_url'],
        'poster' => $v['thumbnail'],
        'formatId' => (string)$v['format_id'],
        'sortOrder' => (int)$v['sort_order'],
        'published' => (bool)$v['published']
    ];
}, $videos);

$formattedShowreel = [
    'title' => $showreel['title'],
    'description' => $showreel['description'],
    'videoUrl' => $showreel['video_url'],
    'poster' => $showreel['poster']
];

echo json_encode([
    'formats' => $formattedFormats,
    'videos' => $formattedVideos,
    'showreel' => $formattedShowreel
]);
