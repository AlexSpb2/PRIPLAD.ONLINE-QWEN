<?php
/**
 * Ping - проверка доступности API
 */

echo json_encode([
    'status' => 'ok',
    'timestamp' => time(),
    'version' => '1.0.0'
]);
