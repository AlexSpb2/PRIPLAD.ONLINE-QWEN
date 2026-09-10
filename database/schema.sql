-- SQL схема для PRIPLAD.ONLINE
-- База данных: priplad_site

-- Таблица форматов
CREATE TABLE IF NOT EXISTS formats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    description TEXT,
    price VARCHAR(100),
    duration VARCHAR(100),
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица видео
CREATE TABLE IF NOT EXISTS videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    format_id INT NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail TEXT,
    duration VARCHAR(100),
    sort_order INT NOT NULL DEFAULT 0,
    published TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (format_id) REFERENCES formats(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица шоурила
CREATE TABLE IF NOT EXISTS showreel (
    id INT PRIMARY KEY DEFAULT 1,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url TEXT,
    poster TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Индексы для оптимизации
CREATE INDEX idx_videos_format_id ON videos(format_id);
CREATE INDEX idx_videos_sort_order ON videos(format_id, sort_order);
CREATE INDEX idx_videos_published ON videos(published);
CREATE INDEX idx_formats_sort_order ON formats(sort_order);

-- Начальные данные для форматов
INSERT INTO formats (name, icon, description, price, duration, sort_order) VALUES
('Нейророзыгрыш', '🎭', 'AI-генерация розыгрышей с неожиданными поворотами', 'от 15 000 ₽', '30–60 сек', 1),
('Одним словом', '💬', 'Короткие видео с мощным визуальным акцентом', 'от 10 000 ₽', '15–30 сек', 2),
('Видео про героев праздника', '🎉', 'Персонализированные поздравления с AI-визуализацией', 'от 12 000 ₽', '45–90 сек', 3);

-- Начальные данные для шоурила
INSERT INTO showreel (id, title, description, video_url, poster) VALUES
(1, 'ШОУРИЛ''26', 'Подборка работ за 2026 год', '', '');
