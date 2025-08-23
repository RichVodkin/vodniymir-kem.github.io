// Конфигурация Telegram
const TELEGRAM_CONFIG = {
    botToken: 'YOUR_BOT_TOKEN', // Замените на ваш токен бота
    chatId: 'YOUR_CHAT_ID',     // Замените на ID чата/канала
    apiUrl: 'https://api.telegram.org/bot'
};

// Функция для отправки сообщения в Telegram
async function sendToTelegram(message) {
    try {
        const response = await fetch(`${TELEGRAM_CONFIG.apiUrl}${TELEGRAM_CONFIG.botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        const result = await response.json();
        
        if (result.ok) {
            console.log('Сообщение отправлено в Telegram');
            return true;
        } else {
            console.error('Ошибка отправки в Telegram:', result);
            return false;
        }
    } catch (error) {
        console.error('Ошибка при отправке в Telegram:', error);
        return false;
    }
}

// Функция для форматирования сообщения
function formatTelegramMessage(formData, formType) {
    const timestamp = new Date().toLocaleString('ru-RU');
    const emoji = formType === 'consultation' ? '📞' : '📝';
    const title = formType === 'consultation' ? 'ЗАЯВКА НА КОНСУЛЬТАЦИЮ' : 'НОВАЯ ЗАЯВКА';
    
    let message = `${emoji} <b>${title}</b>\n\n`;
    message += `📅 <b>Дата:</b> ${timestamp}\n`;
    message += `👤 <b>Имя:</b> ${formData.name}\n`;
    message += `📱 <b>Телефон:</b> ${formData.phone}\n`;
    
    if (formData.preferredContact) {
        message += `💬 <b>Предпочтительный способ связи:</b> ${formData.preferredContact}\n`;
    }
    
    if (formData.service) {
        message += `🔧 <b>Услуга:</b> ${formData.service}\n`;
    }
    
    if (formData.message) {
        message += `💭 <b>Сообщение:</b> ${formData.message}\n`;
    }
    
    message += `\n🌐 <b>Источник:</b> Сайт vodniymir-kem.ru`;
    
    return message;
}

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    document.getElementById('menu-toggle').addEventListener('click', function() {
        document.getElementById('mobile-menu').classList.toggle('hidden');
    });
    
    // Before/After slider functionality
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
        slider.addEventListener('input', function() {
            const sliderValue = this.value;
            const sliderContainer = this.parentElement;
            const beforeImage = sliderContainer.querySelector('.before-after-slider');
            beforeImage.style.width = `${sliderValue}%`;
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Пропускаем обработку для ссылок без хэша
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Рассчитываем позицию с учетом высоты шапки
                const headerHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (!document.getElementById('mobile-menu').classList.contains('hidden')) {
                    document.getElementById('mobile-menu').classList.add('hidden');
                }
            }
        });
    });
    
    // Обработка формы консультации
    document.getElementById('consultation-form')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const checkbox = document.getElementById('consultation-privacy-consent');
        if (!checkbox?.checked) {
            checkbox?.focus();
            checkbox?.parentElement.classList.add('animate-pulse');
            setTimeout(() => checkbox?.parentElement.classList.remove('animate-pulse'), 1000);
            return;
        }
        
        // Собираем данные формы
        const formData = {
            name: this.querySelector('input[type="text"]').value,
            phone: this.querySelector('input[type="tel"]').value,
            preferredContact: this.querySelector('button.bg-blue-500')?.textContent || 'Не указано'
        };
        
        // Форматируем сообщение для Telegram
        const message = formatTelegramMessage(formData, 'consultation');
        
        // Показываем индикатор загрузки
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Отправляем...';
        submitBtn.disabled = true;
        
        try {
            // Отправляем в Telegram
            const success = await sendToTelegram(message);
            
            if (success) {
                // Показываем успешное сообщение
                submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Отправлено!';
                submitBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                submitBtn.classList.add('bg-green-600');
                
                // Очищаем форму
                this.reset();
                
                // Возвращаем кнопку в исходное состояние через 3 секунды
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.classList.remove('bg-green-600');
                    submitBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
                    submitBtn.disabled = false;
                }, 3000);
            } else {
                throw new Error('Ошибка отправки');
            }
        } catch (error) {
            // Показываем ошибку
            submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i>Ошибка';
            submitBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
            submitBtn.classList.add('bg-red-600');
            
            // Возвращаем кнопку в исходное состояние через 3 секунды
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.classList.remove('bg-red-600');
                submitBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
                submitBtn.disabled = false;
            }, 3000);
        }
    });

    // Обработка формы контактов
    document.getElementById('contact-form')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const checkbox = document.getElementById('contact-privacy-consent');
        if (!checkbox?.checked) {
            checkbox?.focus();
            checkbox?.parentElement.classList.add('animate-pulse');
            setTimeout(() => checkbox?.parentElement.classList.remove('animate-pulse'), 1000);
            return;
        }
        
        // Собираем данные формы
        const formData = {
            name: this.querySelector('#name').value,
            phone: this.querySelector('#phone').value,
            service: this.querySelector('#service').value,
            message: this.querySelector('#message').value
        };
        
        // Форматируем сообщение для Telegram
        const message = formatTelegramMessage(formData, 'contact');
        
        // Показываем индикатор загрузки
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Отправляем...';
        submitBtn.disabled = true;
        
        try {
            // Отправляем в Telegram
            const success = await sendToTelegram(message);
            
            if (success) {
                // Показываем успешное сообщение
                submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Отправлено!';
                submitBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                submitBtn.classList.add('bg-green-600');
                
                // Очищаем форму
                this.reset();
                
                // Возвращаем кнопку в исходное состояние через 3 секунды
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.classList.remove('bg-green-600');
                    submitBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
                    submitBtn.disabled = false;
                }, 3000);
            } else {
                throw new Error('Ошибка отправки');
            }
        } catch (error) {
            // Показываем ошибку
            submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i>Ошибка';
            submitBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
            submitBtn.classList.add('bg-red-600');
            
            // Возвращаем кнопку в исходное состояние через 3 секунды
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.classList.remove('bg-red-600');
                submitBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
                submitBtn.disabled = false;
            }, 3000);
        }
    });

    // Обработка кнопок выбора способа связи
    document.querySelectorAll('#consultation-form button[type="button"]').forEach(button => {
        button.addEventListener('click', function() {
            // Удаляем активный класс у всех кнопок
            document.querySelectorAll('#consultation-form button[type="button"]').forEach(btn => {
                btn.classList.remove('bg-blue-500', 'text-white');
                btn.classList.add('bg-gray-100', 'text-gray-800');
            });
            
            // Добавляем активный класс текущей кнопке
            this.classList.remove('bg-gray-100', 'text-gray-800');
            this.classList.add('bg-blue-500', 'text-white');
        });
    });
    
    // Инициализация выбора способа связи по умолчанию
    const consultationButtons = document.querySelectorAll('#consultation-form button[type="button"]');
    if (consultationButtons.length > 0) {
        consultationButtons[0].click();
    }
    
    // Initialize Yandex Map
    if (typeof ymaps !== 'undefined') {
        // Координаты Кемерово (центр карты)
        const kemerovo = [55.354968, 86.087314];
        
        // Инициализация карты
        ymaps.ready(init);
        
        function init() {
            const map = new ymaps.Map("yandex-map", {
                center: kemerovo,
                zoom: 9,
                controls: ['zoomControl']
            });
            
            // Стиль карты (можно выбрать: dark, light, etc)
            map.options.set('suppressMapOpenBlock', true);
            
            // Круг зоны обслуживания (150 км)
            const serviceArea = new ymaps.Circle([
                kemerovo,
                150000 // радиус в метрах
            ], {
                fillColor: "#3b82f680",
                strokeColor: "#1e40af",
                strokeOpacity: 0.8,
                strokeWidth: 2
            });
            
            map.geoObjects.add(serviceArea);
            
            // Добавляем метки для городов
            const cities = [
                { name: "Кемерово", coords: [55.363166, 86.072868], color: "#1e40af" },
                { name: "Новокузнецк", coords: [53.757572, 87.136093], color: "#3b82f6" },
                { name: "Прокопьевск", coords: [53.895355, 86.744657], color: "#3b82f6" },
                { name: "Междуреченск", coords: [53.693575, 88.065342], color: "#3b82f6" },
                { name: "Ленинск-Кузнецкий", coords: [54.660361, 86.169937], color: "#3b82f6" },
                { name: "Юрга", coords: [55.723125, 84.886174], color: "#3b82f6" },
                { name: "Белово", coords: [54.422678, 86.297878], color: "#3b82f6" },
                { name: "Анжеро-Судженск", coords: [56.081944, 86.027500], color: "#3b82f6" }
            ];
            
            cities.forEach(city => {
                const placemark = new ymaps.Placemark(city.coords, {
                    hintContent: city.name,
                    balloonContent: `<b>${city.name}</b>`
                }, {
                    preset: city.name === "Кемерово" 
                        ? 'islands#blueCircleDotIcon' 
                        : 'islands#blueCircleIcon',
                    iconColor: city.color
                });
                
                map.geoObjects.add(placemark);
            });
            
            // Центрируем карту по зоне обслуживания
            map.setBounds(serviceArea.geometry.getBounds());
        }
    }
    
    // Анимация при прокрутке
    const observerOptions = {
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Наблюдаем за всеми элементами с анимацией
    document.querySelectorAll('.animate-fade-in-up').forEach(el => {
        observer.observe(el);
    });

    // Обработка карточек услуг
    const serviceCards = document.querySelectorAll('.service-card');

    function toggleCard(card) {
        const details = card.querySelector('.service-details');
        const btn = card.querySelector('.toggle-details-btn');
        const icon = btn?.querySelector('i');
        const label = btn?.querySelector('span');

        const isOpen = card.classList.toggle('active');

        if (isOpen) {
            details.style.maxHeight = details.scrollHeight + 'px';
            label.textContent = "Скрыть";
            icon?.classList.remove('fa-chevron-down');
            icon?.classList.add('fa-chevron-up');
        } else {
            details.style.maxHeight = '0';
            label.textContent = "Подробнее";
            icon?.classList.remove('fa-chevron-up');
            icon?.classList.add('fa-chevron-down');
        }
    }

    serviceCards.forEach(card => {
        const btn = card.querySelector('.toggle-details-btn');
        const details = card.querySelector('.service-details');

        if (!btn || !details) return;

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            // Закрыть другие карточки
            serviceCards.forEach(other => {
                if (other !== card && other.classList.contains('active')) {
                    other.classList.remove('active');
                    const otherDetails = other.querySelector('.service-details');
                    const otherBtn = other.querySelector('.toggle-details-btn');
                    const otherIcon = otherBtn?.querySelector('i');
                    const otherLabel = otherBtn?.querySelector('span');

                    otherDetails.style.maxHeight = '0';
                    if (otherLabel) otherLabel.textContent = "Подробнее";
                    if (otherIcon) {
                        otherIcon.classList.remove('fa-chevron-up');
                        otherIcon.classList.add('fa-chevron-down');
                    }
                }
            });

            toggleCard(card);
        });
    });

    // Автооткрытие на мобильных
        function handleMobileView() {
            const isMobile = window.innerWidth <= 768;

            serviceCards.forEach(card => {
                const details = card.querySelector('.service-details');
                const toggleBtn = card.querySelector('.toggle-details-btn');

                if (!details || !toggleBtn) return;

                if (isMobile) {
                    card.classList.add('active');
                    details.style.maxHeight = 'none';
                    toggleBtn.style.display = 'none';
                } else {
                    card.classList.remove('active');
                    details.style.maxHeight = '0';
                    toggleBtn.style.display = 'flex';
                    const label = toggleBtn.querySelector('span');
                    const icon = toggleBtn.querySelector('i');
                    if (label) label.textContent = "Подробнее";
                    if (icon) {
                        icon.classList.remove('fa-chevron-up');
                        icon.classList.add('fa-chevron-down');
                    }
                }
            });
        }

        // Инициализация
        handleMobileView();
        window.addEventListener('resize', handleMobileView);
    });