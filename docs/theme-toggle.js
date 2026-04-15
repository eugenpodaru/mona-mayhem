(function () {
	const saved = localStorage.getItem('theme');

	if (saved) {
		document.documentElement.setAttribute('data-theme', saved);
	}
})();

const updateToggleIcon = () => {
	const button = document.querySelector('.theme-toggle');

	if (!button) {
		return;
	}

	const isLight = document.documentElement.getAttribute('data-theme') === 'light';
	button.innerHTML = isLight ? '🌙 Dark' : '☀️ Light';
};

window.toggleTheme = () => {
	const html = document.documentElement;
	const current = html.getAttribute('data-theme');
	const next = current === 'light' ? 'dark' : 'light';

	html.setAttribute('data-theme', next);
	localStorage.setItem('theme', next);
	updateToggleIcon();
};

document.addEventListener('DOMContentLoaded', updateToggleIcon);
