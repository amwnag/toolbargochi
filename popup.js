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
        let formattedTime = new Date(response.value * 1000).toISOString().substring(14, 19);
        timeLabel.innerHTML = formattedTime;
    });
}

function displayHealth() {
    chrome.runtime.sendMessage({message: 'GET_HEALTH'}, function(response) {
        const healthLabel = document.getElementById("health");
        healthLabel.innerHTML = "HP:" + response.value;
    });
}

function displayBuddy() {
    chrome.runtime.sendMessage({message: 'GET_BUDDY_STATE'}, function(response) {
        const buddy = document.getElementsByClassName("buddy")[0];
        if (response.state < 1) {
            buddy.src = "./images/spritesad.png"; 
        } else if (response.state < 2) {
            buddy.src = "./images/sprite2.png"; 
        } else {
            buddy.src = "./images/spritehappy.png"; 
        }
    });
}

function updateDisplay() {
    displayStartButtonIcon();
    displayTimePassed();
    displayHealth();
    displayBuddy();
}

const startButton = document.getElementById("start-button");
startButton.addEventListener("click", pressStopwatch)

// Fetches data every 100 milliseconds
updateDisplay();
setInterval(() => {
    updateDisplay();
}, 100);