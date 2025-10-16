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

// --- Декоративные пузырьки ---
function createBubbles() {
	if (!bubbleContainer) return
	for (let i = 0; i < numberOfBubbles; i++) {
		const bubble = document.createElement('span')
		bubble.classList.add('bubble')
		const size = Math.random() * 50 + 10
		bubble.style.width = `${size}px`
		bubble.style.height = `${size}px`
		bubble.style.left = `${Math.random() * 100}%`
		bubble.style.animationDuration = `${Math.random() * 5 + 5}s`
		bubble.style.animationDelay = `${Math.random() * 5}s`
		bubbleContainer.appendChild(bubble)
	}
}

// --- Подсказки ---
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

// --- Оценка сложности пароля ---
function evaluatePasswordStrength(password) {
	let score = 0
	if (password.length >= 8) score++
	if (password.length >= 12) score++
	if (/[a-z]/.test(password)) score++
	if (/[A-Z]/.test(password)) score++
	if (/[0-9]/.test(password)) score++
	if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password)) score++

	let strength = 'Very Weak'
	if (score >= 2) strength = 'Weak'
	if (score >= 3) strength = 'Medium'
	if (score >= 4) strength = 'Strong'
	if (score >= 5) strength = 'Very Strong'

	return strength
}

// --- Основная функция ---
async function updatePasswordStrength(password) {
	const hasLowerCase = /[a-z]/.test(password)
	const hasUpperCase = /[A-Z]/.test(password)
	const hasNumbers = /[0-9]/.test(password)
	const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)

	// Обновляем индикаторы
	lowerCaseIndicator.classList.toggle('active', hasLowerCase)
	lowerCaseIndicator.classList.toggle('lower', hasLowerCase)
	upperCaseIndicator.classList.toggle('active', hasUpperCase)
	upperCaseIndicator.classList.toggle('upper', hasUpperCase)
	numbersIndicator.classList.toggle('active', hasNumbers)
	numbersIndicator.classList.toggle('numbers', hasNumbers)
	symbolsIndicator.classList.toggle('active', hasSymbols)
	symbolsIndicator.classList.toggle('symbols', hasSymbols)

	charCountPrefixElement.textContent =
		password.length > 0 ? `${password.length} characters containing:` : 'characters containing:'

	if (password.length === 0) {
		strengthText.textContent = 'No Password'
		strengthBar.className = 'strength-bar'
		crackTimeText.textContent = '~'
		feedbackList.innerHTML = ''
		return
	}

	// --- Локальная оценка сложности ---
	const localStrength = evaluatePasswordStrength(password)
	strengthText.textContent = localStrength
	strengthBar.className = 'strength-bar ' + localStrength.toLowerCase().replace(' ', '-')
	updateCrackTime(password)
	updateFrontendFeedback(password, hasLowerCase, hasUpperCase, hasNumbers, hasSymbols)

	// --- Проверка "слитости" через FastAPI ---
	try {
		const response = await fetch('https://api.checkmypassword.xyz', {  // ✅ твой API
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ password }),
		})
		const data = await response.json()

		if (data.error) {
			console.error('Backend error:', data.error)
			addLeakFeedback('Service unavailable')
			return
		}

		if (data.pwned) {
			addLeakFeedback(`⚠️ Password found in leaks ${data.count} times! Choose another one.`)
		} else {
			addLeakFeedback('✅ Password not found in known leaks.')
		}
	} catch (error) {
		console.error('Error checking leaks:', error)
		addLeakFeedback('Service unavailable')
	}

}

// --- Добавление результата HIBP-проверки ---
function addLeakFeedback(message) {
	const li = document.createElement('li')
	li.textContent = message
	li.style.fontWeight = 'bold'
	feedbackList.appendChild(li)
}

// --- Фронтенд-подсказки ---
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

// --- Время взлома ---
function updateCrackTime(password) {
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

const debouncedUpdatePasswordStrength = debounce(updatePasswordStrength, 400)

passwordInput.addEventListener('input', e => {
	debouncedUpdatePasswordStrength(e.target.value)
})

showPasswordCheckbox.addEventListener('change', () => {
	passwordInput.type = showPasswordCheckbox.checked ? 'text' : 'password'
})

updatePasswordStrength('')
createBubbles()
