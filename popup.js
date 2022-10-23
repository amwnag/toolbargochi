function pressStopwatch() {
    chrome.runtime.sendMessage('PRESS_STOPWATCH');
    const startButton = document.getElementById("start-button");
    if (startButton.innerHTML === "Start") {
        startButton.innerHTML = "Stop"; 
    } else if (startButton.innerHTML === "Stop") {
        startButton.innerHTML = "Start"; 
    }

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