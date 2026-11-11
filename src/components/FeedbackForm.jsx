import { useState } from "react";
import "./FeedbackForm.css";

function FeedbackForm() {
  // --- 1. Состояния значений полей (ВСЕ на верхнем уровне!) ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState(""); // Задание 2: Телефон
  const [wantResponse, setWantResponse] = useState(false); // Задание 3: Чекбокс

  // --- 2. Состояния ошибок и "тронутых" полей ---
  const [errors, setErrors] = useState({
    name: null,
    email: null,
    message: null,
    phone: null, // Добавили телефон
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false,
    phone: false, // Добавили телефон
  });

  // --- 3. Состояния отправки ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // --- 4. Функции валидации ---
  const validateName = (value) => {
    if (!value.trim()) return "Имя обязательно для заполнения";
    if (value.trim().length < 2) return "Минимум 2 символа";
    if (!/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(value.trim())) return "Только буквы, пробелы и дефис";
    return null;
  };

  // Задание 3: Зависимая валидация Email
  const validateEmail = (value) => {
    if (wantResponse && !value.trim()) return "Email обязателен для ответа";
    if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return "Некорректный формат email";
    return null;
  };

  const validateMessage = (value) => {
    if (!value.trim()) return "Сообщение обязательно для заполнения";
    if (value.trim().length < 10) return "Минимум 10 символов";
    return null;
  };

  // Задание 2: Валидация телефона
  const validatePhone = (value) => {
    if (!value.trim()) return "Телефон обязателен для заполнения";
    if (!/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(value)) return "Формат: +7 (XXX) XXX-XX-XX";
    return null;
  };

  const validators = {
    name: validateName,
    email: validateEmail,
    message: validateMessage,
    phone: validatePhone, // Добавили в объект
  };

  // --- 5. Обработчики ---
  const handleChange = (field, value) => {
    // Задание 2: Простая маска для телефона
    if (field === "phone") {
      const nums = value.replace(/\D/g, ""); // Оставляем только цифры
      let formatted = "+7";
      if (nums.length > 1) formatted += " (" + nums.substring(1, 4);
      if (nums.length >= 5) formatted += ") " + nums.substring(4, 7);
      if (nums.length >= 8) formatted += "-" + nums.substring(7, 9);
      if (nums.length >= 10) formatted += "-" + nums.substring(9, 11);
      value = nums.length > 1 ? formatted : value;
      setPhone(value);
    } else if (field === "name") {
      setName(value);
    } else if (field === "email") {
      setEmail(value);
    } else if (field === "message") {
      setMessage(value);
    } else if (field === "wantResponse") {
      setWantResponse(value);
      // При изменении чекбокса сразу перепроверяем email
      if (touched.email) {
        setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
      }
      return; // Для чекбокса дальше не идём
    }

    // Live-валидация для тронутых полей
    if (touched[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: validators[field](value),
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    const currentValue = field === "name" ? name : field === "email" ? email : field === "phone" ? phone : message;
    
    setErrors((prev) => ({
      ...prev,
      [field]: validators[field](currentValue),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      name: validateName(name),
      email: validateEmail(email),
      message: validateMessage(message),
      phone: validatePhone(phone), // Добавили проверку телефона
    };

    setErrors(newErrors);
    setTouched({ name: true, email: true, message: true, phone: true });

    if (Object.values(newErrors).some((err) => err !== null)) {
      return; // Прерываем, если есть ошибки
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const getInputClass = (field) => {
    const classes = ["field__input"];
    if (touched[field] && errors[field]) classes.push("field__input--error");
    else if (touched[field] && !errors[field]) classes.push("field__input--valid");
    if (field === "message") classes.push("field__input--textarea");
    return classes.join(" ");
  };

  // --- Экран успеха ---
  if (submitted) {
    return (
      <div className="feedback-form feedback-form--success">
        <h2 className="feedback-form__title">Спасибо за обращение!</h2>
        <p className="feedback-form__text">Мы свяжемся с вами в ближайшее время.</p>
        <button
          type="button"
          className="feedback-form__submit"
          onClick={() => {
            setName(""); setEmail(""); setMessage(""); setPhone(""); setWantResponse(false);
            setErrors({ name: null, email: null, message: null, phone: null });
            setTouched({ name: false, email: false, message: false, phone: false });
            setSubmitted(false);
          }}
        >
          Отправить ещё одно сообщение
        </button>
      </div>
    );
  }

  // --- Основной рендер формы ---
  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      {/* Имя */}
      <div className="field">
        <label htmlFor="name" className="field__label">Имя</label>
        <input id="name" type="text" className={getInputClass("name")} value={name}
          onChange={(e) => handleChange("name", e.target.value)} onBlur={() => handleBlur("name")} />
        {touched.name && errors.name && <span className="field__error">{errors.name}</span>}
      </div>

      {/* Задание 3: Чекбокс "Хочу получить ответ" */}
      <div className="field" style={{ flexDirection: "row", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
        <input 
          id="wantResponse" 
          type="checkbox" 
          checked={wantResponse} 
          onChange={(e) => handleChange("wantResponse", e.target.checked)} 
          style={{ width: "auto", margin: 0 }}
        />
        <label htmlFor="wantResponse" className="field__label" style={{ margin: 0, cursor: "pointer" }}>
          Хочу получить ответ на Email
        </label>
      </div>

      {/* Email */}
      <div className="field">
        <label htmlFor="email" className="field__label">Email {wantResponse && <span style={{color: "red"}}>*</span>}</label>
        <input id="email" type="email" className={getInputClass("email")} value={email}
          onChange={(e) => handleChange("email", e.target.value)} onBlur={() => handleBlur("email")} />
        {touched.email && errors.email && <span className="field__error">{errors.email}</span>}
      </div>

      {/* Задание 2: Телефон */}
      <div className="field">
        <label htmlFor="phone" className="field__label">Телефон</label>
        <input id="phone" type="tel" className={getInputClass("phone")} value={phone} placeholder="+7 (XXX) XXX-XX-XX"
          onChange={(e) => handleChange("phone", e.target.value)} onBlur={() => handleBlur("phone")} />
        {touched.phone && errors.phone && <span className="field__error">{errors.phone}</span>}
      </div>

      {/* Сообщение + Задание 1: Счётчик символов */}
      <div className="field">
        <label htmlFor="message" className="field__label">Сообщение</label>
        <textarea id="message" className={getInputClass("message")} value={message}
          onChange={(e) => handleChange("message", e.target.value)} onBlur={() => handleBlur("message")}
          rows={5} maxLength={500} />
        {touched.message && errors.message && <span className="field__error">{errors.message}</span>}
        
        {/* Счётчик символов */}
        <div style={{ fontSize: '13px', color: message.length >= 500 ? '#e5484d' : '#666', textAlign: 'right', marginTop: '4px' }}>
          {message.length} / 500
        </div>
      </div>

      <button type="submit" className="feedback-form__submit" disabled={isSubmitting}>
        {isSubmitting ? "Отправка…" : "Отправить"}
      </button>
    </form>
  );
}

export default FeedbackForm;