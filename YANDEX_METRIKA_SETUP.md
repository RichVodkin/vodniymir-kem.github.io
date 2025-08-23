# 📊 Настройка Яндекс.Метрики

## Шаг 1: Создание счетчика

1. Перейдите на [Яндекс.Метрика](https://metrika.yandex.ru/)
2. Нажмите "Добавить счетчик"
3. Заполните информацию:
   - **Название:** Водный Мир Кемерово
   - **Сайт:** https://vodniymir-kem.ru
   - **Часовой пояс:** UTC+7 (Кемерово)
   - **Валюта:** RUB

## Шаг 2: Получение ID счетчика

После создания счетчика вы получите ID вида: `12345678`

## Шаг 3: Замена в коде

В файле `index.html` замените `YOUR_COUNTER_ID` на ваш реальный ID:

```html
<!-- Заменить в двух местах -->
ym(YOUR_COUNTER_ID, "init", {
    defer: true,
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true
});

<!-- И здесь -->
<img src="https://mc.yandex.ru/watch/YOUR_COUNTER_ID" style="position:absolute; left:-9999px;" alt="" />
```

## Шаг 4: Настройка целей

### Цель 1: Заявка на консультацию
- **Название:** Заявка на консультацию
- **Тип:** JavaScript событие
- **Условие:** `ym(12345678, 'reachGoal', 'consultation_form')`

### Цель 2: Заявка на контакты
- **Название:** Заявка на контакты  
- **Тип:** JavaScript событие
- **Условие:** `ym(12345678, 'reachGoal', 'contact_form')`

### Цель 3: Звонок
- **Название:** Звонок
- **Тип:** JavaScript событие
- **Условие:** `ym(12345678, 'reachGoal', 'phone_call')`

## Шаг 5: Добавление отслеживания в JavaScript

В файле `assets/js/main.js` добавьте в функции отправки форм:

```javascript
// В функции отправки формы консультации
if (success) {
    // Отправка в Яндекс.Метрику
    if (typeof ym !== 'undefined') {
        ym(YOUR_COUNTER_ID, 'reachGoal', 'consultation_form');
    }
}

// В функции отправки формы контактов
if (success) {
    // Отправка в Яндекс.Метрику
    if (typeof ym !== 'undefined') {
        ym(YOUR_COUNTER_ID, 'reachGoal', 'contact_form');
    }
}

// Для отслеживания звонков
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', function() {
        if (typeof ym !== 'undefined') {
            ym(YOUR_COUNTER_ID, 'reachGoal', 'phone_call');
        }
    });
});
```

## Шаг 6: Проверка работы

1. Откройте сайт в браузере
2. Откройте DevTools (F12)
3. Перейдите на вкладку Network
4. Найдите запросы к `mc.yandex.ru`
5. Убедитесь, что счетчик загружается

## Дополнительные настройки

### Вебвизор
- Включен по умолчанию
- Позволяет записывать действия пользователей

### Карта кликов
- Включена по умолчанию
- Показывает, куда кликают пользователи

### Карта скроллинга
- Показывает, как далеко прокручивают страницу

## Важно!
- Не забудьте заменить `YOUR_COUNTER_ID` на реальный ID
- Проверьте работу счетчика перед запуском сайта
- Настройте цели для отслеживания конверсий
