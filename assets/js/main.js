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
    
    // Checkbox validation for contact form
    document.getElementById('contact-form')?.addEventListener('submit', function(e) {
        const checkbox = document.getElementById('contact-privacy-consent');
        if (!checkbox?.checked) {
            e.preventDefault();
            checkbox?.focus();
            checkbox?.parentElement.classList.add('animate-pulse');
            setTimeout(() => checkbox?.parentElement.classList.remove('animate-pulse'), 1000);
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