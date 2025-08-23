# 🚀 Быстрая настройка Telegram интеграции

## Шаг 1: Создание бота
1. Откройте Telegram и найдите @BotFather
2. Отправьте `/newbot`
3. Введите имя: "Водный Мир Кемерово - Заявки"
4. Введите username: `vodniymir_kem_bot` (или любой другой)
5. **Сохраните токен бота!**

## Шаг 2: Получение ID чата
1. Найдите созданного бота и нажмите "Start"
2. Отправьте боту любое сообщение
3. Откройте в браузере: `https://api.telegram.org/bot<ВАШ_ТОКЕН>/getUpdates`
4. Найдите `"chat":{"id":123456789}` - это ваш chat_id

## Шаг 3: Настройка сайта
1. Откройте `assets/js/main.js`
2. Найдите секцию `TELEGRAM_CONFIG`
3. Замените:
   - `YOUR_BOT_TOKEN` на ваш токен
   - `YOUR_CHAT_ID` на ваш chat_id

## Шаг 4: Тестирование
1. Сохраните файл
2. Откройте сайт
3. Отправьте тестовую заявку
4. Проверьте Telegram

## Пример настройки:
```javascript
const TELEGRAM_CONFIG = {
    botToken: '123456789:ABCdefGHIjklMNOpqrsTUVwxyz',
    chatId: '987654321',
    apiUrl: 'https://api.telegram.org/bot'
};
```

**Подробные инструкции:** См. `TELEGRAM_SETUP.md`
