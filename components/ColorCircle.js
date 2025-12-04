// components/ColorCircle.js
import React from 'react';

/**
 * ColorCircle Component
 * نمایش یک دایره رنگی برای انتخاب یا نمایش رنگ
 *
 * Props:
 * - color: کد رنگ (hex یا rgb) مثل "#ff0000"
 * - size: اندازه دایره (پیش‌فرض 32px)
 * - selected: اگر true باشه، یک border دور دایره نمایش داده می‌شه
 * - onClick: تابعی که هنگام کلیک روی دایره اجرا می‌شه
 */
export default function ColorCircle({ color, size = 32, selected = false, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        cursor: onClick ? 'pointer' : 'default',
        border: selected ? '2px solid #000' : '1px solid #ccc',
        boxShadow: selected ? '0 0 5px rgba(0,0,0,0.3)' : 'none',
        transition: 'all 0.2s ease-in-out',
      }}
    />
  );
}