// Script only for main page

// const backALevel = document.querySelector('.backALevel');
const refreshBtn = document.querySelector('.refresh');
const tipBtn = document.querySelector('.tip');
const tipText = document.querySelector('.tip-text');
const dialog = document.querySelector('.tipDialog');
const tipWindowCloseBtn = document.querySelector('.closeTip');
const iframe = document.querySelector('.iframe');
const levelDisplay = document.querySelector('.level');
const levelCompletedDiv = document.querySelector('.levelCompleted');
const tipContentDiv = document.querySelector('.tipContent');
const levelCompletedH1 = document.querySelector('.levelCompletedH1');
const stayBtn = document.querySelector('.stay');
const nextLevelBtn = document.querySelector('.nextLevel');
const levelCompleteText = document.querySelector('.levelCompleteText');

// Add new elements for confirm dialogs
const confirmDialogDiv = document.createElement('div');
confirmDialogDiv.className = 'confirmDialog';
confirmDialogDiv.style.display = 'none';

const confirmTitle = document.createElement('h1');
confirmTitle.className = 'confirmTitle';
confirmDialogDiv.appendChild(confirmTitle);

const confirmMessage = document.createElement('p');
confirmMessage.className = 'confirmMessage';
confirmDialogDiv.appendChild(confirmMessage);

const confirmButtonsDiv = document.createElement('div');
confirmButtonsDiv.className = 'confirmButtons';
confirmDialogDiv.appendChild(confirmButtonsDiv);

const cancelBtn = document.createElement('button');
cancelBtn.className = 'cancelBtn';
cancelBtn.textContent = 'Cancel';
confirmButtonsDiv.appendChild(cancelBtn);

const confirmBtn = document.createElement('button');
confirmBtn.className = 'confirmBtn highlight';
confirmButtonsDiv.appendChild(confirmBtn);

// Add the confirm dialog to the existing dialog element
dialog.appendChild(confirmDialogDiv);

// Track current level
let currentLevel = 0;

function setup() {
	const urlParams = new URLSearchParams(window.location.search);
	const level = parseInt(urlParams.get('level'));
	// console.log("level: " + level);

	if (level) {
		goToLevel(level);
	} else {
		goToLevel(0);
	}

	updateLevelDisplay(level);
}

// Listen for messages from the iframe
window.addEventListener('message', function(event) {
	if (!event.data) return;

	switch (event.data.type) {
		case 'levelComplete':
			handleLevelComplete(event.data.level);
			break;
		case 'backToLevel':
			goToLevel(event.data.returnLevel);
			break;
		case 'fakeButton':
			goToFakePage(event.data.level);
			break;
		case 'showTip':
			showTip();
			break;
		case 'levelData':
			currentLevel = event.data.level;
			updateLevelDisplay(event.data.level);
			updateBackButton(event.data.level);
			updateTipSystem(event.data.allowTip, event.data.tip);
			updateCompleteText(event.data.cmpleteText);
			break;
		case 'requestFullScreen':
			requestFullScreen();
			break;
		case 'exitFullScreen':
			exitFullScreen();
			break;
		case 'restart':
			restart();
			break;
		case 'showMessage':
			showMessage(event.data.message, event.data.title, event.data.button);
			break;
	}
});

function requestFullScreen() {
	const docElement = document.documentElement;
	
	if (docElement.requestFullscreen) {
		docElement.requestFullscreen();
	} else if (docElement.mozRequestFullScreen) { // Firefox
		docElement.mozRequestFullScreen();
	} else if (docElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
		docElement.webkitRequestFullscreen();
	} else if (docElement.msRequestFullscreen) { // IE/Edge
		docElement.msRequestFullscreen();
	}
}

function exitFullScreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.mozCancelFullScreen) { // Firefox
		document.mozCancelFullScreen();
	} else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
		document.webkitExitFullscreen();
	} else if (document.msExitFullscreen) { // IE/Edge
		document.msExitFullscreen();
	}
}

function restart() {
	document.location.reload();	
}

function updateBackButton(level) {
	if (level <= 1 || level === -1) {
		// backALevel.style.display = 'none';
		refreshBtn.style.display = 'none';
		return;
	} else {
		// backALevel.style.display = 'block';
		// refreshBtn.style.marginLeft = '5px';
	}
	
	// backALevel.textContent = `Back to level ${level - 1}`;
}

function updateLevelDisplay(level) {
	if (level === 0 || level === -1 || level === 21) {
		levelDisplay.style.display = 'none';
		refreshBtn.style.display = 'none';
		// refreshBtn.style.marginLeft = '5px';
		return;
	} else {
		levelDisplay.style.display = 'block';
		refreshBtn.style.display = 'block';
		refreshBtn.style.marginLeft = '0';
	}
	
	levelDisplay.textContent = `Level ${level}`;
}

function updateTipSystem(allowTip, tipContent) {

	// Update tip visibility based on allowTip
	tipBtn.style.display = allowTip ? 'block' : 'none';
	
	// Update tip content
	tipText.innerHTML = tipContent || 'No tip available for this level.';
}

function updateCompleteText(content) {
	levelCompleteText.style.display = content ? 'block' : 'none';

	levelCompleteText.innerHTML = content || '';
}

function handleLevelComplete(level) {
	// Show level completed dialog
	if (level > 0) {
		showLevelCompletedDialog(level);
	} else {
		const nextLevel = level + 1;
		goToLevel(nextLevel);
	}
}

function showLevelCompletedDialog(level) {
	// Hide tip content and show level completed content
	tipContentDiv.style.display = 'none';
	levelCompletedDiv.style.display = 'block';

	if (level === 20) {
		levelCompletedH1.innerHTML = `All Levels is Completed!`;
		nextLevelBtn.textContent = 'Finish';
	} else {
		levelCompletedH1.innerHTML = `Level ${level} Completed!`;
		nextLevelBtn.textContent = 'Next Level';
	}

	// Show the dialog
	dialog.showModal();


	nextLevelBtn.focus();
	
	// Set up event listeners for the buttons
	stayBtn.onclick = function() {
		closeLevelCompletedDialog();
	};
	
	nextLevelBtn.onclick = function() {
		closeLevelCompletedDialog();
		const nextLevel = level + 1;
		goToLevel(nextLevel);
	};
}

function closeLevelCompletedDialog() {
	dialog.close();
	// Reset the dialog for future use
	tipContentDiv.style.display = 'block';
	levelCompletedDiv.style.display = 'none';
	confirmDialogDiv.style.display = 'none';
}

function goToLevel(level) {
	// console.log("Going to level: " + level);
	iframe.src = `levels/${level}.html`;
}

function backToPreviousLevel() {
	if (currentLevel > 1) {
		showConfirmDialog(
			'Go Back',
			'Are you sure you want to go back to the previous level?',
			'Go Back',
			() => {
				goToLevel(currentLevel - 1);
			}
		);
	}
}

function refreshCurrentLevel() {
	showConfirmDialog(
		'Refresh Level',
		'Are you sure you want to refresh the current level?',
		'Refresh',
		() => {
			goToLevel(currentLevel);
		},
		'refresh-theme' // Added theme parameter for yellow styling
	);
}

function showMessage(message, title, button) {
	// Hide other dialog content
	tipContentDiv.style.display = 'none';
	levelCompletedDiv.style.display = 'none';
	confirmDialogDiv.style.display = 'block';
	cancelBtn.style.display = 'none';

	// Set dialog content
	confirmTitle.textContent = title || 'Message';
	confirmMessage.textContent = message;
	confirmBtn.textContent = button || 'OK';

	// Reset theme classes
	confirmTitle.className = 'confirmTitle';
	confirmBtn.className = 'confirmBtn highlight';

	// Show the dialog
	dialog.showModal();

	confirmBtn.focus();

	const handleConfirm = () => {
		closeConfirmDialog();
		// Remove event listeners
		confirmBtn.removeEventListener('click', handleConfirm);
	};

	confirmBtn.addEventListener('click', handleConfirm);
}

function showConfirmDialog(title, message, confirmText, onConfirm, theme = 'default-theme') {
	// Hide other dialog content
	tipContentDiv.style.display = 'none';
	levelCompletedDiv.style.display = 'none';
	confirmDialogDiv.style.display = 'block';
	cancelBtn.style.display = 'block';
	
	// Set dialog content
	confirmTitle.textContent = title;
	confirmMessage.textContent = message;
	confirmBtn.textContent = confirmText;
	
	// Reset theme classes
	confirmTitle.className = 'confirmTitle';
	confirmBtn.className = 'confirmBtn highlight';
	
	// Apply theme if specified
	if (theme === 'refresh-theme') {
		confirmTitle.classList.add('yellow-theme');
		confirmBtn.classList.add('yellow-theme');
	}
	
	// Show the dialog
	dialog.showModal();

	confirmBtn.focus();
	
	// Set up button event handlers
	const handleConfirm = () => {
		closeConfirmDialog();
		onConfirm();
		// Remove event listeners
		confirmBtn.removeEventListener('click', handleConfirm);
		cancelBtn.removeEventListener('click', handleCancel);
	};
	
	const handleCancel = () => {
		closeConfirmDialog();
		// Remove event listeners
		confirmBtn.removeEventListener('click', handleConfirm);
		cancelBtn.removeEventListener('click', handleCancel);
	};
	
	confirmBtn.addEventListener('click', handleConfirm);
	cancelBtn.addEventListener('click', handleCancel);
}

function closeConfirmDialog() {
	dialog.close();
	// Reset the dialog for future use
	confirmDialogDiv.style.display = 'none';
}

function showTip() {
	// Make sure the tip content is visible and level completed is hidden
	tipContentDiv.style.display = 'block';
	levelCompletedDiv.style.display = 'none';
	confirmDialogDiv.style.display = 'none';
	dialog.showModal();
	tipWindowCloseBtn.focus();
}

function closeTip() {
	dialog.close();
}

setup();
tipBtn.addEventListener('click', showTip);
tipWindowCloseBtn.addEventListener('click', closeTip);
// backALevel.addEventListener('click', backToPreviousLevel);
refreshBtn.addEventListener('click', refreshCurrentLevel);

// Disable right click context menu
document.addEventListener('contextmenu', (e) => {
	e.preventDefault();
});


function goToFakePage(returnLevel) {
	// Navigate to fake page with return level as a parameter
	iframe.src = `levels/fake.html?returnLevel=${returnLevel}`;
}

window.addEventListener("beforeunload", function (e) {
	if (currentLevel === 0 || currentLevel === 21) return;
	let confirmationMessage = 'It looks like you have been editing something. '
		+ 'If you leave before saving, your changes will be lost.';

	(e || window.event).returnValue = confirmationMessage; //Gecko + IE
	return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
});