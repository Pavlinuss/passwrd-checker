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

const strengthLabels = {
	no_password: 'No Password',
	very_weak: 'Very Weak',
	weak: 'Weak',
	medium: 'Medium',
	strong: 'Strong',
	very_strong: 'Very Strong',
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

function updatePasswordStrength(password) {
	let score = 0
	const feedbackKeys = []

	if (password.length > 0) {
		if (password.length >= 8) {
			score++
		} else {
			feedbackKeys.push('length')
		}
		if (/[a-z]/.test(password)) {
			score++
		} else {
			feedbackKeys.push('lowercase')
		}
		if (/[A-Z]/.test(password)) {
			score++
		} else {
			feedbackKeys.push('uppercase')
		}
		if (/[0-9]/.test(password)) {
			score++
		} else {
			feedbackKeys.push('numbers')
		}
		if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) {
			score++
		} else {
			feedbackKeys.push('symbols')
		}
		if (password.length >= 12) {
			score++
		}
	}

	let strengthLabelKey = 'no_password'
	let barClass = 'no-password'

	if (password.length > 0) {
		if (score <= 1) {
			strengthLabelKey = 'very_weak'
			barClass = 'very-weak'
		} else if (score === 2) {
			strengthLabelKey = 'weak'
			barClass = 'weak'
		} else if (score === 3) {
			strengthLabelKey = 'medium'
			barClass = 'medium'
		} else if (score === 4) {
			strengthLabelKey = 'strong'
			barClass = 'strong'
		} else {
			strengthLabelKey = 'very_strong'
			barClass = 'very-strong'
		}
	} else {
		score = 0
	}

	strengthText.textContent = strengthLabels[strengthLabelKey]

	strengthBar.className = 'strength-bar'
	if (password.length > 0) {
		strengthBar.classList.add(barClass)
	} else {
		strengthBar.style.width = '0%'
	}

	updateCharIndicators(password)

	updateFeedback(feedbackKeys)

	updateCrackTime(password)
}

function updateCharIndicators(password) {
	const hasLowerCase = /[a-z]/.test(password)
	const hasUpperCase = /[A-Z]/.test(password)
	const hasNumbers = /[0-9]/.test(password)
	const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)

	lowerCaseIndicator.classList.toggle('active', hasLowerCase)
	lowerCaseIndicator.classList.toggle('lower', hasLowerCase)

	upperCaseIndicator.classList.toggle('active', hasUpperCase)
	upperCaseIndicator.classList.toggle('upper', hasUpperCase)

	numbersIndicator.classList.toggle('active', hasNumbers)
	numbersIndicator.classList.toggle('numbers', hasNumbers)

	symbolsIndicator.classList.toggle('active', hasSymbols)
	symbolsIndicator.classList.toggle('symbols', hasSymbols)
}

function updateFeedback(feedbackKeys) {
	feedbackList.innerHTML = ''
	feedbackKeys.forEach(key => {
		const message = feedbackMessages[key]
		if (message) {
			const li = document.createElement('li')
			li.textContent = message
			feedbackList.appendChild(li)
		}
	})
}

function updateCrackTime(password) {
	if (password.length === 0) {
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

passwordInput.addEventListener('input', e => {
	updatePasswordStrength(e.target.value)
})

showPasswordCheckbox.addEventListener('change', () => {
	passwordInput.type = showPasswordCheckbox.checked ? 'text' : 'password'
})

updatePasswordStrength('')
createBubbles()
