const passwordInput = document.getElementById('passwordInput')
const strengthBar = document.getElementById('strengthBar')
const strengthText = document.getElementById('strengthText')
const showPasswordCheckbox = document.getElementById('showPasswordCheckbox')
const charCount = document.getElementById('charCount')
const charCountPrefixElement = document.getElementById('charCountPrefix')
const lowerCaseIndicator = document.getElementById('lowerCaseIndicator')
const upperCaseIndicator = document.getElementById('upperCaseIndicator')
const numbersIndicator = document.getElementById('numbersIndicator')
const symbolsIndicator = document.getElementById('symbolsIndicator')
const crackTimeText = document.getElementById('crackTimeText')
const feedbackList = document.getElementById('feedbackList')

function updatePasswordStrength(password) {
	let strengthValue = 0
	let strengthLabelKey = 'strength_no_password'
	let barClass = 'bg-gray-300'
	const feedbackMessagesKeys = []

	if (password.length > 0) {
		if (password.length < 8) {
			feedbackMessagesKeys.push('feedback_length')
		}
		if (!/[a-z]/.test(password)) {
			feedbackMessagesKeys.push('feedback_lowercase')
		}

		if (strengthValue < 2) {
			strengthLabelKey = 'strength_very_weak'
			barClass = 'bg-red-500'
		} else if (strengthValue < 3) {
			strengthLabelKey = 'strength_weak'
			barClass = 'bg-orange-500'
		} else if (strengthValue < 4) {
			strengthLabelKey = 'strength_medium'
			barClass = 'bg-yellow-500'
		} else if (strengthValue < 5) {
			strengthLabelKey = 'strength_strong'
			barClass = 'bg-green-400'
		} else {
			strengthLabelKey = 'strength_very_strong'
			barClass = 'bg-green-600'
		}
	} else {
		strengthValue = 0
		barClass = 'bg-gray-300'
	}

	strengthText.textContent = getTranslation(strengthLabelKey)

	strengthBar.style.width = `${(strengthValue / 5) * 100}%`
	strengthBar.className = `strength-bar ${barClass}`

	updateCharIndicators(password)

	updateCharCountText(password.length)

	updateFeedback(feedbackMessagesKeys)
}

function updateCharIndicators(password) {
	const hasLowerCase = /[a-z]/.test(password)
	const hasUpperCase = /[A-Z]/.test(password)
	const hasNumbers = /[0-9]/.test(password)
	const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)

	lowerCaseIndicator.classList.toggle('active', hasLowerCase)
	upperCaseIndicator.classList.toggle('active', hasUpperCase)
	numbersIndicator.classList.toggle('active', hasNumbers)
	symbolsIndicator.classList.toggle('active', hasSymbols)
}

function updateCharCountText(length) {
	if (charCount) {
		let countSpan = charCount.querySelector('.char-count-number')
		if (!countSpan) {
			countSpan = document.createElement('span')
			countSpan.className = 'char-count-number'
			charCount.prepend(countSpan)
			if (!charCount.textContent.includes(' ')) {
				charCount.insertBefore(
					document.createTextNode(' '),
					charCountPrefixElement
				)
			}
		}
		countSpan.textContent = length
	}
	if (charCountPrefixElement) {
		charCountPrefixElement.textContent = getTranslation('char_count_prefix')
	}
}

function updateFeedback(feedbackKeys) {
	feedbackList.innerHTML = ''
	feedbackKeys.forEach(key => {
		const li = document.createElement('li')
		li.textContent = getTranslation(key)
		feedbackList.appendChild(li)
	})
}

function updateDynamicTexts(lang) {
	const currentPassword = passwordInput.value
	updatePasswordStrength(currentPassword)
}

passwordInput.addEventListener('input', e => {
	updatePasswordStrength(e.target.value)
})

showPasswordCheckbox.addEventListener('change', () => {
	passwordInput.type = showPasswordCheckbox.checked ? 'text' : 'password'
})
