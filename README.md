# PRIPLAD.ONLINE

Портфолио AI-видео режиссёра Алексея Приклада.

## Структура проекта

```
PRIPLAD.ONLINE-QWEN/
├── api/                    # PHP API backend
│   ├── config.example.php  # Шаблон конфигурации (скопируйте в config.php)
│   ├── index.php           # Роутер API
│   ├── helpers.php         # Вспомогательные функции
│   ├── ping.php            # Проверка доступности
│   ├── login.php           # Авторизация
│   ├── logout.php          # Выход
│   ├── check_auth.php      # Проверка авторизации
│   ├── data.php            # Получение всех данных
│   ├── add_video.php       # Добавление видео
│   ├── update_video.php    # Обновление видео
│   ├── delete_video.php    # Удаление видео
│   ├── reorder_videos.php  # Изменение порядка видео
│   ├── add_format.php      # Добавление формата
│   ├── update_format.php   # Обновление формата
│   ├── delete_format.php   # Удаление формата
│   ├── update_showreel.php # Обновление шоурила
│   └── video_preview.php   # Получение превью видео
├── database/
│   └── schema.sql          # SQL схема базы данных
├── src/                    # React frontend
│   ├── api/
│   │   └── api.ts          # API клиент
│   ├── admin/              # Админка
│   ├── components/         # Компоненты
│   ├── pages/              # Страницы
│   ├── store/              # Состояние приложения
│   └── types.ts            # Типы TypeScript
├── .htaccess               # Конфигурация Apache
└── package.json
```

## Установка

### 1. Frontend

```bash
npm install
npm run build
```

Собранные файлы будут в папке `dist/`.

### 2. Backend

#### Настройка базы данных

1. Создайте базу данных `priplad_site`:
```sql
CREATE DATABASE priplad_site CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Создайте пользователя:
```sql
CREATE USER 'priplad_user'@'localhost' IDENTIFIED BY 'YOUR_PASSWORD';
GRANT ALL PRIVILEGES ON priplad_site.* TO 'priplad_user'@'localhost';
FLUSH PRIVILEGES;
```

3. Импортируйте схему:
```bash
mysql -u priplad_user -p priplad_site < database/schema.sql
```

#### Настройка API

1. Скопируйте шаблон конфигурации:
```bash
cp api/config.example.php api/config.php
```

2. Отредактируйте `api/config.php`:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'priplad_site');
define('DB_USER', 'priplad_user');
define('DB_PASS', 'YOUR_REAL_PASSWORD');

// Сгенерируйте хэш пароля:
// php -r "echo password_hash('YOUR_ADMIN_PASSWORD', PASSWORD_DEFAULT);"
define('ADMIN_PASSWORD_HASH', '$2y$10$...');
```

3. Убедитесь, что `api/config.php` НЕ загружен в git (добавлен в .gitignore).

### 3. Деплой

#### Структура на сервере

```
/var/www/priplad.online/
├── public/              # Содержимое dist/
│   ├── index.html
│   ├── assets/
│   └── ...
├── api/                 # PHP API
│   ├── config.php       # НЕ в git!
│   ├── index.php
│   └── ...
├── .htaccess            # Конфигурация Apache
└── ...
```

#### Копирование файлов

```bash
# Frontend
cp -r dist/* /var/www/priplad.online/public/

# Backend
cp -r api/ /var/www/priplad.online/api/
cp .htaccess /var/www/priplad.online/

# Конфигурация (вручную на сервере!)
# Скопируйте и отредактируйте api/config.php на сервере
```

#### Настройка Apache

Убедитесь, что Apache настроен правильно:

```apache
<VirtualHost *:443>
    ServerName priplad.online
    DocumentRoot /var/www/priplad.online/public
    
    <Directory /var/www/priplad.online/public>
        AllowOverride All
        Require all granted
    </Directory>
    
    # API
    Alias /api /var/www/priplad.online/api
    <Directory /var/www/priplad.online/api>
        AllowOverride All
        Require all granted
    </Directory>
    
    # SSL
    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem
</VirtualHost>
```

## Использование

### Публичная часть

Откройте `https://priplad.online`

### Админка

Откройте `https://priplad.online/admin`

Войдите с паролем, указанным в `api/config.php`.

## API Endpoints

Все endpoints доступны через `/api/index.php?action=ACTION_NAME`

### Публичные (без авторизации)

- `ping` - проверка доступности
- `data` - получение всех данных (форматы, видео, шоурил)
- `video_preview` - получение превью видео

### Защищённые (требуют авторизации)

- `login` - авторизация
- `logout` - выход
- `check_auth` - проверка авторизации
- `add_video` - добавление видео
- `update_video` - обновление видео
- `delete_video` - удаление видео
- `reorder_videos` - изменение порядка видео
- `add_format` - добавление формата
- `update_format` - обновление формата
- `delete_format` - удаление формата (каскадно удаляет видео)
- `update_showreel` - обновление шоурила

## Поддерживаемые видеоформаты

- YouTube / YouTube Shorts
- Vimeo
- RuTube
- VK Video (включая video_ext.php)
- Прямые видеофайлы (.mp4, .webm, .mov, .m4v, .ogv)
- iframe/embed коды

## Безопасность

- Пароль администратора хранится в хэшированном виде
- Сессии PHP для авторизации
- Prepared statements для SQL запросов
- Валидация входных данных
- CORS настроен для домена priplad.online
- `config.php` не загружается в git

## Разработка

### Локальный запуск frontend

```bash
npm run dev
```

### Локальный запуск backend

Для локальной разработки можно использовать встроенный PHP сервер:

```bash
php -S localhost:8000 -t api
```

Затем измените `API_BASE` в `src/api/api.ts` на `http://localhost:8000`.

## Решение проблем

### API недоступен

1. Проверьте, что PHP установлен и работает
2. Проверьте права доступа к файлам API
3. Проверьте логи ошибок Apache/PHP
4. Убедитесь, что `api/config.php` существует и заполнен

### Ошибка подключения к БД

1. Проверьте настройки в `api/config.php`
2. Убедитесь, что пользователь БД имеет нужные права
3. Проверьте, что база данных создана

### Ошибка авторизации

1. Убедитесь, что хэш пароля в `config.php` сгенерирован правильно:
   ```bash
   php -r "echo password_hash('YOUR_PASSWORD', PASSWORD_DEFAULT);"
   ```
2. Проверьте, что сессии PHP работают
3. Проверьте права на запись в директорию сессий

## Лицензия

Все права защищены. © 2026 Алексей Приклад
