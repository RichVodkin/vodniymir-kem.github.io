// Пример конфигурации для Telegram интеграции
// Скопируйте этот файл в config.js и заполните своими данными

const TELEGRAM_CONFIG = {
    // Токен вашего Telegram бота (получите у @BotFather)
    botToken: 'YOUR_BOT_TOKEN_HERE',
    
    // ID чата или канала для получения заявок
    // Для личного чата: положительное число
    // Для группы/канала: отрицательное число
    chatId: 'YOUR_CHAT_ID_HERE',
    
    // URL API Telegram (не изменяйте)
    apiUrl: 'https://api.telegram.org/bot'
};

// Пример заполненной конфигурации:
/*
const TELEGRAM_CONFIG = {
    botToken: '123456789:ABCdefGHIjklMNOpqrsTUVwxyz',
    chatId: '987654321',
    apiUrl: 'https://api.telegram.org/bot'
};
*/

// Экспорт конфигурации
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TELEGRAM_CONFIG;
}
