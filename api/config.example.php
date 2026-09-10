<?php
/**
 * Конфигурация API
 * 
 * ВАЖНО: Этот файл НЕ должен быть в git!
 * Создайте копию как config.php и заполните реальными данными.
 */

// Настройки базы данных
define('DB_HOST', 'localhost');
define('DB_NAME', 'priplad_site');
define('DB_USER', 'priplad_user');
define('DB_PASS', 'YOUR_PASSWORD_HERE');

// Секретный ключ для хэширования пароля
define('ADMIN_PASSWORD_HASH', '$2y$10$YOUR_HASHED_PASSWORD_HERE');

// Настройки сессии
define('SESSION_LIFETIME', 86400); // 24 часа в секундах

// CORS настройки (если нужно)
define('ALLOWED_ORIGINS', ['https://priplad.online', 'http://localhost:3000']);
