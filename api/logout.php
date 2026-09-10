<?php
/**
 * Logout - выход из системы
 */

session_start();
session_destroy();

echo json_encode([
    'success' => true,
    'message' => 'Logout successful'
]);
