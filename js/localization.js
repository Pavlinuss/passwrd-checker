const translations = {
	en: {
		title: 'PasswordMonster - How Secure is Your Password?',
		header_brand: 'PasswordMonster',
		header_contact: 'info@passwordmonster.com',
		main_title: 'How Secure is Your Password?',
		ad_placeholder: 'Advertisement',
		test_title: 'Take the Password Test',
		test_tip_strong: 'Tip:',
		test_tip_text:
			'Avoid the use of dictionary words or common names, and avoid using any personal information',
		password_placeholder: 'Type a password',
		strength_no_password: 'No Password',
		show_password_label: 'Show password',
		char_count_prefix: 'characters containing:',
		indicator_lower: 'Lower case',
		indicator_upper: 'Upper case',
		indicator_numbers: 'Numbers',
		indicator_symbols: 'Symbols',
		crack_time_label: 'Time to crack your password:',
		disclaimer:
			'Your passwords are never stored. Even if they were, we have no idea who you are!',
		strength_very_weak: 'Very Weak',
		strength_weak: 'Weak',
		strength_medium: 'Medium',
		strength_strong: 'Strong',
		strength_very_strong: 'Very Strong',
		feedback_length: 'Password should be at least 8 characters long.',
		feedback_lowercase: 'Include lowercase letters.',
		feedback_uppercase: 'Include uppercase letters.',
		feedback_numbers: 'Include numbers.',
		feedback_symbols: 'Include symbols (e.g., !@#$%^&*).',
		feedback_common: 'Avoid common passwords.',
		feedback_sequential: "Avoid sequential characters (e.g., '123', 'abc').",
		feedback_repeating: "Avoid repeating characters (e.g., 'aaa', '111').",
	},
	ru: {
		title: 'PasswordMonster - Насколько безопасен ваш пароль?',
		header_brand: 'PasswordMonster',
		header_contact: 'info@passwordmonster.com',
		main_title: 'Насколько безопасен ваш пароль?',
		ad_placeholder: 'Реклама',
		test_title: 'Пройдите тест пароля',
		test_tip_strong: 'Совет:',
		test_tip_text:
			'Избегайте использования словарных слов или распространенных имен, а также любой личной информации',
		password_placeholder: 'Введите пароль',
		strength_no_password: 'Нет пароля',
		show_password_label: 'Показать пароль',
		char_count_prefix: 'символов, содержащих:',
		indicator_lower: 'Нижний регистр',
		indicator_upper: 'Верхний регистр',
		indicator_numbers: 'Цифры',
		indicator_symbols: 'Символы',
		crack_time_label: 'Время для взлома вашего пароля:',
		disclaimer:
			'Ваши пароли никогда не сохраняются. Даже если бы сохранялись, мы понятия не имеем, кто вы!',
		strength_very_weak: 'Очень слабый',
		strength_weak: 'Слабый',
		strength_medium: 'Средний',
		strength_strong: 'Сильный',
		strength_very_strong: 'Очень сильный',
		feedback_length: 'Пароль должен содержать не менее 8 символов.',
		feedback_lowercase: 'Используйте строчные буквы.',
		feedback_uppercase: 'Используйте прописные буквы.',
		feedback_numbers: 'Используйте цифры.',
		feedback_symbols: 'Используйте символы (например, !@#$%^&*).',
		feedback_common: 'Избегайте распространенных паролей.',
		feedback_sequential:
			"Избегайте последовательных символов (например, '123', 'abc').",
		feedback_repeating:
			"Избегайте повторяющихся символов (например, 'aaa', '111').",
	},
}

function setLanguage(lang) {
	localStorage.setItem('language', lang)

	document.documentElement.lang = lang

	document.querySelectorAll('[data-translate]').forEach(element => {
		const key = element.getAttribute('data-translate')
		if (translations[lang] && translations[lang][key]) {
			if (element.tagName === 'INPUT' && element.placeholder) {
				element.placeholder = translations[lang][key]
			} else if (key === 'title') {
				document.title = translations[lang][key]
			} else {
				const strongTag = element.querySelector('strong')
				if (strongTag && key === 'test_tip_text') {
					const strongKey = strongTag.getAttribute('data-translate')
					if (strongKey && translations[lang][strongKey]) {
						strongTag.textContent = translations[lang][strongKey]
					}
					element.childNodes.forEach(node => {
						if (
							node.nodeType === Node.TEXT_NODE &&
							node.textContent.trim() !== ''
						) {
							node.textContent = ' ' + translations[lang][key]
						}
					})
				} else {
					element.textContent = translations[lang][key]
				}
			}
		}
	})

	if (typeof updateDynamicTexts === 'function') {
		updateDynamicTexts(lang)
	}

	document.querySelectorAll('.lang-switch-btn').forEach(btn => {
		if (btn.getAttribute('data-lang') === lang) {
			btn.classList.add('active-lang')
			btn.classList.remove('opacity-50')
		} else {
			btn.classList.remove('active-lang')
			btn.classList.add('opacity-50')
		}
	})
}

function getCurrentLanguage() {
	return localStorage.getItem('language') || 'en'
}

document.addEventListener('DOMContentLoaded', () => {
	const currentLang = getCurrentLanguage()
	setLanguage(currentLang)

	document.querySelectorAll('.lang-switch-btn').forEach(button => {
		button.addEventListener('click', event => {
			const lang = event.target.getAttribute('data-lang')
			if (lang) {
				setLanguage(lang)
			}
		})
	})
})

function getTranslation(key, lang = getCurrentLanguage()) {
	return translations[lang]?.[key] || key
}
