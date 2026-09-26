# 🎨 Руководство по анимациям OKURMEN IT Landing Page

## ✨ Добавленные креативные эффекты

### 1. **Hero Section - Разноуровневые заголовки**
- ✅ Заголовок разделен на 2 линии с разными уровнями
- ✅ Первая линия появляется слева с 3D-эффектом
- ✅ Вторая линия появляется справа со смещением вправо
- ✅ Анимация `slideInFromSide` с эффектом перспективы

**CSS классы:**
- `.hero-title-stack` - контейнер с перспективой
- `.staggered-title` - flex контейнер для линий
- `.title-line-1` и `.title-line-2` - отдельные линии с задержкой анимации

### 2. **Карусель отзывов (Reviews Section)**
- ✅ Автоматическая прокрутка каждые 4 секунды
- ✅ Пауза при наведении мыши
- ✅ Кнопки навигации влево/вправо
- ✅ Индикаторы внизу (точки)
- ✅ 3 состояния карточек: active, prev, next
- ✅ Плавные переходы с cubic-bezier

**Особенности:**
- Активная карточка: полная непрозрачность, scale(1)
- Предыдущая: 30% непрозрачность, сдвиг влево
- Следующая: 30% непрозрачность, сдвиг вправо
- Остальные: невидимы

**CSS классы:**
- `.reviews-carousel-container` - основной контейнер
- `.carousel-track` - трек для карточек
- `.carousel-card.active` - активная карточка
- `.carousel-nav` - кнопки навигации
- `.carousel-indicators` - индикаторы точек

### 3. **Scroll-анимации для всех секций**
- ✅ Intersection Observer для определения видимости
- ✅ Анимации запускаются при входе в viewport
- ✅ Эффект появляется только 1 раз (performance)

**Hook:** `useScrollAnimation(threshold)`
- Параметр `threshold` - процент видимости для срабатывания (0.2 = 20%)
- Возвращает `{ ref, isVisible }`

**Используется в:**
- AboutSection
- CoursesSection
- StudentsSection
- TeamSection
- HybridLearningSection
- GrantSection
- LaptopsSection
- ContactsSection

### 4. **Fade-in-up эффект**
- ✅ Заголовки плавно появляются снизу вверх
- ✅ Используется для section headers

**CSS класс:** `.fade-in-up`
- Анимация: `fadeInUp` (0.8s ease-out)
- Начало: opacity 0, translateY(40px)
- Конец: opacity 1, translateY(0)

### 5. **3D Card эффекты**
- ✅ Карточки получают 3D-трансформацию при hover
- ✅ Поворот по осям Y и X
- ✅ Подъем вперед (translateZ)
- ✅ Увеличенная тень

**CSS класс:** `.card-3d`
- Hover: `rotateY(5deg) rotateX(5deg) translateZ(20px)`
- Тень увеличивается до 50px
- Плавный переход с кубической кривой

**Используется в:**
- CoursesSection (карточки курсов)
- StudentsSection (достижения)
- TeamSection (команда)
- GrantSection (основная карточка гранта)

### 6. **Stagger-анимация (поэтапное появление)**
- ✅ Элементы появляются по очереди
- ✅ Каждый следующий с задержкой 0.1-0.2s

**CSS класс:** `.stagger-item`
- До 5 элементов с разными задержками
- Анимация: `fadeInStagger` (0.6s ease-out)

**Используется в:**
- AboutSection (статистика)
- StudentsSection (достижения)
- TeamSection (карточки команды)

### 7. **Float-animation (плавающие элементы)**
- ✅ Медленное движение вверх-вниз
- ✅ Бесконечная анимация

**CSS класс:** `.float-animation`
- Цикл: 3 секунды
- Амплитуда: -15px
- Используется для декоративных элементов

**Используется в:**
- StudentsSection (главная статистика)
- LaptopsSection (визуализация ноутбука)
- GrantSection (фоновые круги)
- ContactsSection (фоновые круги)

### 8. **Pulse-glow эффект**
- ✅ Пульсирующее свечение
- ✅ Изменение box-shadow

**CSS класс:** `.pulse-glow`
- Цикл: 2 секунды
- Светлая тема: оранжевое свечение
- Темная тема: более яркое оранжевое свечение

**Используется в:**
- Hero (badge)
- GrantSection (специальное предложение)
- HybridLearningSection (timeline)

### 9. **Animated Gradient Background**
- ✅ Движущийся градиентный фон
- ✅ 4 цвета меняются позицией

**CSS класс:** `.animated-gradient-bg`
- Светлая тема: пастельные тона (оранжевый, розовый, голубой, желтый)
- Темная тема: темные оттенки синего
- Цикл: 15 секунд
- Background-size: 400%

**Используется в:**
- HeroSection

### 10. **Floating Particles (плавающие частицы)**
- ✅ 5 декоративных частиц с радиальным градиентом
- ✅ Разные траектории движения
- ✅ Разные задержки анимации

**CSS:** `.floating-particle`
- Размер: 100x100px
- Форма: круг с радиальным градиентом
- Цвет: полупрозрачный оранжевый (светлая тема) / ярко-оранжевый (темная)
- Анимация: сложная траектория с изменением scale и opacity

**Используется в:**
- HeroSection (5 частиц в разных местах)

### 11. **Magnetic hover эффект**
- ✅ Легкое увеличение при наведении

**CSS класс:** `.magnetic-hover`
- Scale: 1.05
- Transition: 0.3s ease

**Используется в:**
- AboutSection (статистика)
- GrantSection (главная карточка)

### 12. **Parallax Section**
- ✅ Подготовлен класс для parallax-эффекта
- ✅ Overflow скрыт для правильной работы

**CSS класс:** `.parallax-section`
- Position: relative
- Overflow: hidden

### 13. **Bounce-in эффект**
- ✅ Появление с отскоком
- ✅ Elastic-анимация

**CSS класс:** `.feature-card-bounce`
- Начало: scale(0.3)
- Средина: scale(1.05) - перелет
- 70%: scale(0.9) - отскок
- Конец: scale(1)

**Используется в:**
- CoursesSection (карточки курсов при появлении)

### 14. **Ripple-эффект на кнопках**
- ✅ Волновой эффект при hover

**CSS класс:** `.btn-enhanced`
- Псевдо-элемент `::before` создает круг
- При hover круг расширяется до 300px
- Цвет: полупрозрачный белый

**Используется в:**
- HeroSection (основные кнопки)

### 15. **Glass morphism**
- ✅ Эффект стекла с размытием

**CSS класс:** `.glass`
- Background: полупрозрачный
- Backdrop-filter: blur(10px)
- Border: полупрозрачная граница

**Используется в:**
- HeroSection (feature cards)

### 16. **Icon Gradient с вращением**
- ✅ Иконки в градиентном фоне
- ✅ Вращение 360° при hover

**CSS класс:** `.icon-gradient`
- Background: оранжево-розовый градиент
- Hover: rotate(360deg) + scale(1.1)
- Увеличенная тень

**Используется в:**
- HeroSection (feature icons)

## 🎯 Темная тема

Все анимации адаптированы для темной темы:
- Более яркие цвета свечения
- Темные градиенты
- Увеличенная непрозрачность теней
- Специальные цвета для particle effects

## 📱 Responsive

- На мобильных устройствах упрощены некоторые эффекты
- Carousel показывает только активную карточку
- Уменьшены размеры кнопок навигации
- Отключено смещение для `.title-line-2`

## ♿ Accessibility

```css
@media (prefers-reduced-motion: reduce) {
  /* Все анимации сокращены до минимума */
}
```

Пользователи с чувствительностью к движению увидят статичную версию.

## 🚀 Performance

- IntersectionObserver используется для ленивой загрузки анимаций
- Анимации отключаются после первого показа
- Используется `will-change` для оптимизации
- CSS-анимации предпочтительнее JavaScript

## 📝 Как использовать

### Добавить scroll-анимацию к новой секции:

```tsx
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function MySection() {
  const { ref, isVisible } = useScrollAnimation(0.2);
  
  return (
    <section 
      ref={ref}
      className={isVisible ? 'section-transition visible' : 'section-transition'}
    >
      {/* Контент */}
    </section>
  );
}
```

### Добавить stagger-эффект:

```tsx
<div className="grid">
  {items.map((item, index) => (
    <div 
      key={index}
      className={`card ${isVisible ? 'stagger-item' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Контент */}
    </div>
  ))}
</div>
```

## 🎨 Цветовая схема анимаций

- **Основной:** #f97316 (оранжевый)
- **Акцент:** #d946ef (розовый)
- **Дополнительный:** #a855f7 (фиолетовый)
- **Темная тема основной:** #ff8c42
- **Темная тема акцент:** #f066ff

---

**Автор:** Kiro AI  
**Дата:** 2026-09-26  
**Проект:** OKURMEN IT Landing Page
