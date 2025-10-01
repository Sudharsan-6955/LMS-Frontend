import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';


import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './assets/css/animate.css';

// Ensure icon fonts and main styles are bundled in the app (so icons render in production)
import './assets/css/icofont.min.css';
import './assets/css/style.min.css';

// Small runtime check to warn if IcoFont doesn't appear to be loaded in the browser.
// This logs a helpful message to the console during runtime to aid debugging.
function _checkIcoFontLoaded() {
	const el = document.createElement('i');
	el.className = 'icofont-twitter';
	el.style.position = 'absolute';
	el.style.left = '-9999px';
	el.style.top = '-9999px';
	document.body.appendChild(el);
	// Allow layout to compute
	requestAnimationFrame(() => {
		try {
			const cs = window.getComputedStyle(el);
			const ff = cs && cs.fontFamily ? cs.fontFamily : '';
			if (!/IcoFont/i.test(ff) && !/icofont/i.test(ff)) {
				// Friendly developer hint
				/* eslint-disable no-console */
				console.warn(
					'IcoFont does not appear to be loaded (computed font-family: "' +
						ff +
						'"). Ensure src/assets/css/icofont.min.css is present, or the CDN link is in public/index.html.'
				);
				/* eslint-enable no-console */
			}
		} catch (err) {
			/* eslint-disable no-console */
			console.warn('IcoFont check failed:', err);
			/* eslint-enable no-console */
		} finally {
			document.body.removeChild(el);
		}
	});
}
if (typeof window !== 'undefined') {
	window.addEventListener('load', _checkIcoFontLoaded);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
