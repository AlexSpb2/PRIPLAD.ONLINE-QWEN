# Админка PRIPLAD.ONLINE

## Доступ

Админка доступна по URL:
- `/admin` (основной путь)
- `#/admin` (hash-based, для совместимости)

**Пароль для входа:** `priplad2026`

## Структура

### Вкладки админки

1. **Видео** — управление видео по форматам
   - Drag-and-drop для изменения порядка
   - Публикация/скрытие видео
   - CRUD операции
   - Фильтрация по форматам

2. **Форматы** — управление форматами видео
   - Создание/редактирование/удаление форматов
   - Иконки (emoji)
   - Цена и длительность
   - Каскадное удаление (формат + все его видео)

3. **Шоурил** — настройка главного видео
   - Заголовок и описание
   - URL видео
   - Постер

## Публичная часть

### Логика отображения

- **Шоурил** — одно главное видео (настраивается в админке)
- **Работы** — по умолчанию показываются первые 2 опубликованных видео каждого формата
- **Фильтр по форматам** — при выборе формата показываются все его опубликованные видео

### Поддерживаемые видео

- YouTube / YouTube Shorts
- Vimeo
- RuTube
- VK Video (включая `video_ext.php`)
- Прямые видеофайлы (.mp4, .webm, .mov)
- iframe/embed

## Архитектура

### API-слой

Файл: `src/api/mockApi.ts`

Сейчас используется mock API с localStorage. В будущем будет заменён на fetch к PHP API + MySQL.

**Методы API:**
- `login(password)` — авторизация
- `ping()` — проверка авторизации
- `logout()` — выход
- `data()` — получение всех данных
- `addVideo(video)` — добавить видео
- `updateVideo(id, updates)` — обновить видео
- `deleteVideo(id)` — удалить видео
- `reorderVideos(formatId, videoIds)` — изменить порядок видео
- `addFormat(format)` — добавить формат
- `updateFormat(id, updates)` — обновить формат
- `deleteFormat(id)` — удалить формат (каскадно)
- `updateShowreel(showreel)` — обновить шоурил

### Типы данных

Файл: `src/types.ts`

```typescript
interface Format {
  id: string;
  name: string;
  icon: string;
  description: string;
  price: string;
  duration: string;
  sortOrder: number;
}

interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  poster: string;
  formatId: string;
  sortOrder: number;
  published: boolean;
}

interface Showreel {
  title: string;
  description: string;
  videoUrl: string;
  poster: string;
}
```

### Хранилище состояния

Файл: `src/store/AppContext.tsx`

React Context для управления состоянием приложения. Используется как в публичной части, так и в админке.

## Файлы

```
src/
├── admin/
│   ├── AdminPage.tsx          # Главная страница админки
│   ├── AdminLayout.tsx        # Layout с навигацией
│   ├── LoginPage.tsx          # Страница авторизации
│   ├── VideosPage.tsx         # Управление видео
│   ├── VideoForm.tsx          # Форма видео
│   ├── FormatsPage.tsx        # Управление форматами
│   ├── FormatForm.tsx         # Форма формата
│   └── ShowreelPage.tsx       # Управление шоурилом
├── api/
│   └── mockApi.ts             # Mock API (localStorage)
├── store/
│   └── AppContext.tsx         # React Context
├── pages/
│   └── PublicPage.tsx         # Публичная часть
├── components/                # Компоненты публичной части
├── types.ts                   # Типы данных
└── App.tsx                    # Роутинг
```

## Следующие шаги

1. **PHP API + MySQL**
   - Создать endpoints для всех методов API
   - Настроить базу данных с таблицами `formats`, `videos`, `showreel`
   - Заменить `mockApi.ts` на fetch-запросы

2. **Безопасность**
   - Хэширование пароля на сервере
   - JWT токены для авторизации
   - CSRF защита

3. **Загрузка файлов**
   - Загрузка видеофайлов через админку
   - Генерация постеров из видео
   - Интеграция с CDN/S3

4. **Дополнительные функции**
   - Статистика просмотров
   - Комментарии/обратная связь
   - Экспорт данных
