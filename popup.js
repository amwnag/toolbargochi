function pressStopwatch() {
    chrome.runtime.sendMessage('PRESS_STOPWATCH');
}

function displayStartButtonIcon() {
    chrome.runtime.sendMessage({message: 'GET_START_STOP'}, function(response) {
        let startIcon = document.getElementById("start-stop-icon");
        if (response.started) {
            startIcon.src = "./images/buttonstop.png"; 
        } else if (!response.started) {
            startIcon.src = "./images/buttonstart.png"; 
        }
    });
}

function displayTimePassed() {
    chrome.runtime.sendMessage({message: 'GET_TIME_PASSED'}, function(response) {
        const timeLabel = document.getElementById("time");
        timeLabel.innerHTML = response.value;
    });
}

function displayHealth() {
    chrome.runtime.sendMessage({message: 'GET_HEALTH'}, function(response) {
        const healthLabel = document.getElementById("health");
        healthLabel.innerHTML = response.value;
    });
}

function updateDisplay() {
    displayStartButtonIcon();
    displayTimePassed();
    displayHealth();
}

const startButton = document.getElementById("start-button");
startButton.addEventListener("click", pressStopwatch)

// Fetches data every 100 milliseconds
updateDisplay();
setInterval(() => {
    updateDisplay();
}, 100);