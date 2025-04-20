// Global Script

var currentLevel = 0;
const nextBtn = document.getElementById("next");

function setup(level, allowTip, tip, completeText) {
	currentLevel = level;
	// Send tip data to parent window
	window.parent.postMessage({ 
		type: 'levelData', 
		level: level, 
		allowTip: allowTip, 
		tip: tip,
		cmpleteText: completeText
	}, '*');
	
	// Set up button event listeners
	setupButtonListeners(level);
}

function next() {
	window.parent.postMessage({ type: 'levelComplete', level: currentLevel }, '*');
}

function fake() {
	// Pass the current level when sending fake button message
	window.parent.postMessage({ type: 'fakeButton', level: currentLevel }, '*');
}

function setupButtonListeners(level) {

	// Add event listeners to all buttons with the respective IDs
	document.querySelectorAll("#next").forEach(button => {
		button.addEventListener("click", next);
	});
	document.querySelectorAll("#fake").forEach(button => {
		button.addEventListener("click", fake);
	});
}

function next() {
	window.parent.postMessage({ type: 'levelComplete', level: level }, '*');
}

function fake() {
	window.parent.postMessage({ type: 'fakeButton', level: level }, '*');
}

// function tip() {
// 	window.parent.postMessage({ type: 'showTip', level: level }, '*');
// }

document.addEventListener('contextmenu', (e) => {
	e.preventDefault();
});