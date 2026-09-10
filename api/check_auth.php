<?php
/**
 * Check auth - проверка авторизации
 */

$isAuthenticated = !empty($_SESSION['authenticated']) && $_SESSION['authenticated'] === true;

echo json_encode([
    'authenticated' => $isAuthenticated
]);
