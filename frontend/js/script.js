const passwordInput = document.getElementById('passwordInput')
const strengthBar = document.getElementById('strengthBar')
const strengthText = document.getElementById('strengthText')
const showPasswordCheckbox = document.getElementById('showPasswordCheckbox')
const charCountPrefixElement = document.getElementById('charCountPrefix')
const lowerCaseIndicator = document.getElementById('lowerCaseIndicator')
const upperCaseIndicator = document.getElementById('upperCaseIndicator')
const numbersIndicator = document.getElementById('numbersIndicator')
const symbolsIndicator = document.getElementById('symbolsIndicator')
const crackTimeText = document.getElementById('crackTimeText')
const feedbackList = document.getElementById('feedbackList')

const bubbleContainer = document.getElementById('bubble-container')
const numberOfBubbles = 25

// Декоративные пузырьки (без изменений)
function createBubbles() {
	if (!bubbleContainer) return

	for (let i = 0; i < numberOfBubbles; i++) {
		const bubble = document.createElement('span')
		bubble.classList.add('bubble')

		const size = Math.random() * 50 + 10
		bubble.style.width = `${size}px`
		bubble.style.height = `${size}px`

		bubble.style.left = `${Math.random() * 100}%`

		const duration = Math.random() * 5 + 5
		bubble.style.animationDuration = `${duration}s`

		const delay = Math.random() * 5
		bubble.style.animationDelay = `${delay}s`

		bubbleContainer.appendChild(bubble)
	}
}

const feedbackMessages = {
	length: 'Password should be at least 8 characters long.',
	lowercase: 'Include lowercase letters.',
	uppercase: 'Include uppercase letters.',
	numbers: 'Include numbers.',
	symbols: 'Include symbols (e.g., !@#$%^&*).',
	common: 'Avoid common passwords.',
	sequential: "Avoid sequential characters (e.g., '123', 'abc').",
	repeating: "Avoid repeating characters (e.g., 'aaa', '111').",
}

// Основная функция
async function updatePasswordStrength(password) {
	// Проверка символов
	const hasLowerCase = /[a-z]/.test(password)
	const hasUpperCase = /[A-Z]/.test(password)
	const hasNumbers = /[0-9]/.test(password)
	const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)
	
	// Обновляем индикаторы символов
	lowerCaseIndicator.classList.toggle('active', hasLowerCase)
	lowerCaseIndicator.classList.toggle('lower', hasLowerCase)
	upperCaseIndicator.classList.toggle('active', hasUpperCase)
	upperCaseIndicator.classList.toggle('upper', hasUpperCase)
	numbersIndicator.classList.toggle('active', hasNumbers)
	numbersIndicator.classList.toggle('numbers', hasNumbers)
	symbolsIndicator.classList.toggle('active', hasSymbols)
	symbolsIndicator.classList.toggle('symbols', hasSymbols)
	
	// Обновляем счетчик символов
	charCountPrefixElement.textContent = password.length > 0 
		? `${password.length} characters containing:` 
		: 'characters containing:'
	
	if (password.length === 0) {
		// Сброс UI если пароль пустой
		strengthText.textContent = 'No Password'
		strengthBar.className = 'strength-bar'
		crackTimeText.textContent = '~'
		feedbackList.innerHTML = ''
		return
	}
	
	try {
		// Запрос к бэкенду
		const response = await fetch('https://api.checkmypassword.xyz:8000/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ password })
		})
		const backendData = await response.json()
		
		// Прямой вывод сложности от бэкенда
		strengthText.textContent = backendData.strength || 'Error'
		
		// Обновляем шкалу
		strengthBar.className = 'strength-bar ' + 
			(backendData.strength ? backendData.strength.toLowerCase() : 'error')
		
		// Время взлома
		updateCrackTime(password)
		
		// Обновляем рекомендации
		updateFrontendFeedback(password, hasLowerCase, hasUpperCase, hasNumbers, hasSymbols)
		
	} catch (error) {
		console.error('Backend error:', error)
		strengthText.textContent = 'Error'
		strengthBar.className = 'strength-bar error'
		feedbackList.innerHTML = '<li>Service unavailable</li>'
	}
}

// Фронтенд-проверка для feedback (без изменений)
function updateFrontendFeedback(password, hasL, hasU, hasN, hasS) {
	const feedbackKeys = []
	
	if (password.length < 8) feedbackKeys.push('length')
	if (!hasL) feedbackKeys.push('lowercase')
	if (!hasU) feedbackKeys.push('uppercase')
	if (!hasN) feedbackKeys.push('numbers')
	if (!hasS) feedbackKeys.push('symbols')
	
	feedbackList.innerHTML = ''
	feedbackKeys.forEach(key => {
		const li = document.createElement('li')
		li.textContent = feedbackMessages[key]
		feedbackList.appendChild(li)
	})
}

// Время взлома (без изменений)
function updateCrackTime(password) {
	if (!password) {
		crackTimeText.textContent = '~'
		return
	}
	
	let time = 'Instantly'
	if (password.length >= 8) time = 'Seconds'
	if (password.length >= 10) time = 'Minutes'
	if (password.length >= 12) time = 'Hours'
	if (password.length >= 14) time = 'Days'
	if (password.length >= 16) time = 'Years'
	if (password.length >= 18) time = 'Centuries'
	
	crackTimeText.textContent = time
}

// --- Debounce ---
function debounce(func, delay) {
	let timeout
	return function (...args) {
		clearTimeout(timeout)
		timeout = setTimeout(() => func.apply(this, args), delay)
	}
}

// Обёртка для updatePasswordStrength (400мс)
const debouncedUpdatePasswordStrength = debounce(updatePasswordStrength, 400)

// Обработчики
passwordInput.addEventListener('input', e => {
	debouncedUpdatePasswordStrength(e.target.value)
})

showPasswordCheckbox.addEventListener('change', () => {
	passwordInput.type = showPasswordCheckbox.checked ? 'text' : 'password'
})

// Инициализация
updatePasswordStrength('')
createBubbles()
